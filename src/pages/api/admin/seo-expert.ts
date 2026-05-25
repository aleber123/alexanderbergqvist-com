/**
 * SEO Expert — cross-source analysis combining:
 *   - Google Search Console (sökord, klick, position per sida)
 *   - GA4 (sessions, bounce, engagement per sida)
 *   - App Store Connect (downloads + revenue per app, per country)
 *
 * For each app we have a config in src/content/apps/<slug>.json with
 * its bundleId and appStoreUrl. The expert correlates:
 *   GSC clicks → /<slug>/  →  GA4 sessions → /<slug>/  →  ASC installs
 *
 * Drop-offs in this funnel surface as insights:
 *   - High GSC clicks, low GA4 sessions → site loading issue
 *   - High GA4 sessions, low ASC installs → bad App Store CTA
 *   - High ASC installs but low GSC traffic → install source is non-SEO
 *
 * POST /api/admin/seo-expert
 * Body: { days?: number (default 30) }
 *
 * Auth: same as seo-report (x-admin-password header).
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  dateRange,
  ga4RunReport,
  json,
  querySearchAnalytics,
  requireAdminAuth,
} from '../../../lib/google-api';
import {
  fetchLatestSubscriptions,
  fetchSalesRange,
  listApps,
  summarizeByApp,
  summarizeSubscriptionsByApp,
  type AppSalesSummary,
  type AppSubscriptionSummary,
  type SalesRow,
} from '../../../lib/asc';

export const prerender = false;

interface AppRow {
  slug: string;
  name: string;
  bundleId: string;
  // GSC
  gscClicks: number;
  gscImpressions: number;
  gscCtr: number;
  gscAvgPosition: number;
  // GA4
  gaSessions: number;
  gaUsers: number;
  gaBounceRate: number;
  // ASC sales (free installs)
  ascUnits: number;
  ascProceeds: number;
  ascCurrency: string;
  ascTopCountries: { cc: string; units: number }[];
  // ASC subscriptions (paid recurring — this is real money)
  ascActiveSubs: number;
  ascFreeTrials: number;
  ascMrr: number;
  ascMrrCurrency: string;
  ascSubTiers: { name: string; active: number; price: number; currency: string; durationDays: number }[];
  // Derived
  searchToSession: number; // gaSessions / gscClicks (1.0 = no loss)
  sessionToInstall: number; // ascUnits / gaSessions
  searchToInstall: number; // ascUnits / gscClicks
  installToSubConversion: number; // ascActiveSubs / ascUnits — the conversion that matters
  // Per-article breakdown: which URLs under this app drive search traffic,
  // sorted by GSC clicks descending. Lets the UI drill-down from app-row
  // into the specific articles to attribute MRR per article.
  topArticles: ArticleRow[];
}

interface ArticleRow {
  /** Full URL (relative path with leading /), e.g. /sv/surdeg/sourdough-not-rising/ */
  path: string;
  gscClicks: number;
  gscImpressions: number;
  gscCtr: number;
  gscAvgPosition: number;
  gaSessions: number;
  /** Share of this app's total GSC clicks contributed by this article (0-1). */
  shareOfAppClicks: number;
  /** Estimated MRR contribution = shareOfAppClicks × app's total MRR.
   *  Assumes search traffic converts uniformly across articles for the same
   *  app — rough, but lets us rank articles by economic value. */
  estimatedMrrContribution: number;
}

interface Insight {
  severity: 'high' | 'med' | 'low';
  icon: string;
  app?: string;
  title: string;
  detail: string;
  action?: string;
}

function safeRatio(num: number, denom: number): number {
  return denom > 0 ? num / denom : 0;
}

const LOCALE_PREFIXES = [
  'sv', 'en', 'de', 'fr', 'es', 'it', 'no', 'nb', 'da', 'fi', 'is',
  'nl', 'pt', 'pl', 'el',
];

/** True if a full URL (https://...) belongs to the given app slug, both
 *  for default-locale (/<slug>/...) and lang-prefixed (/<lang>/<slug>/...)
 *  routes. */
function isAppUrl(fullUrl: string, slug: string): boolean {
  const u = fullUrl.replace(/^https?:\/\/[^/]+/, '');
  return isAppPath(u, slug);
}

function isAppPath(path: string, slug: string): boolean {
  if (path.startsWith(`/${slug}/`) || path === `/${slug}`) return true;
  for (const p of LOCALE_PREFIXES) {
    if (path.startsWith(`/${p}/${slug}/`) || path === `/${p}/${slug}`) {
      return true;
    }
  }
  return false;
}

function buildAppRow(
  slug: string,
  name: string,
  bundleId: string,
  gscRows: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[],
  gaPages: { page: string; sessions: number; users: number; bounceRate: number }[],
  ascSummary: AppSalesSummary | null,
  ascSubs: AppSubscriptionSummary | null,
): AppRow {
  // GSC rows are keyed by full URL — match both the default-locale routes
  // (/<slug>/...) and the lang-prefixed routes (/<lang>/<slug>/...).
  // Using two prefixes catches /en/surdeg/, /de/surdeg/, etc. without
  // false-matching, e.g., /surdeg-foo/.
  const sc = gscRows.filter((r) => isAppUrl(r.keys[0], slug));
  const gscClicks = sc.reduce((s, r) => s + r.clicks, 0);
  const gscImpressions = sc.reduce((s, r) => s + r.impressions, 0);
  const gscCtr = safeRatio(gscClicks, gscImpressions);
  // Weighted average position by impressions
  const positionWeight = sc.reduce(
    (s, r) => s + r.position * r.impressions,
    0,
  );
  const gscAvgPosition = gscImpressions > 0 ? positionWeight / gscImpressions : 0;

  const ga = gaPages.filter((p) => isAppPath(p.page, slug));
  const gaSessions = ga.reduce((s, p) => s + p.sessions, 0);
  const gaUsers = ga.reduce((s, p) => s + p.users, 0);
  // Average bounce rate weighted by sessions
  const bounceWeight = ga.reduce((s, p) => s + p.bounceRate * p.sessions, 0);
  const gaBounceRate = gaSessions > 0 ? bounceWeight / gaSessions : 0;

  const ascUnits = ascSummary?.units ?? 0;
  const ascProceeds = ascSummary?.proceeds ?? 0;
  const ascCurrency = ascSummary?.currency ?? 'USD';
  const ascTopCountries = ascSummary
    ? Object.entries(ascSummary.byCountry)
        .map(([cc, units]) => ({ cc, units }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 5)
    : [];

  // Top articles for this app, ranked by GSC clicks.
  // GA pageviews matched by path so we can show pageviews per article too.
  const gaByPath = new Map<string, number>();
  for (const p of ga) gaByPath.set(p.page, (gaByPath.get(p.page) || 0) + p.sessions);

  const mrr = ascSubs?.mrrEstimate ?? 0;
  const topArticles: ArticleRow[] = sc
    .map((r) => {
      const path = r.keys[0].replace(/^https?:\/\/[^/]+/, '');
      const articleShare = gscClicks > 0 ? r.clicks / gscClicks : 0;
      return {
        path,
        gscClicks: r.clicks,
        gscImpressions: r.impressions,
        gscCtr: r.ctr,
        gscAvgPosition: r.position,
        gaSessions: gaByPath.get(path) || 0,
        shareOfAppClicks: articleShare,
        estimatedMrrContribution: articleShare * mrr,
      };
    })
    .filter((a) => a.gscClicks > 0 || a.gscImpressions > 5)
    .sort((a, b) => b.gscClicks - a.gscClicks || b.gscImpressions - a.gscImpressions)
    .slice(0, 20);

  return {
    slug,
    name,
    bundleId,
    gscClicks,
    gscImpressions,
    gscCtr,
    gscAvgPosition,
    gaSessions,
    gaUsers,
    gaBounceRate,
    ascUnits,
    ascProceeds,
    ascCurrency,
    ascTopCountries,
    ascActiveSubs: ascSubs?.activeSubscribers ?? 0,
    ascFreeTrials: ascSubs?.freeTrials ?? 0,
    ascMrr: ascSubs?.mrrEstimate ?? 0,
    ascMrrCurrency: ascSubs?.mrrCurrency ?? 'USD',
    ascSubTiers: (ascSubs?.byTier ?? []).map((t) => ({
      name: t.name,
      active: t.activeSubs,
      price: t.price,
      currency: t.currency,
      durationDays: t.durationDays,
    })),
    searchToSession: safeRatio(gaSessions, gscClicks),
    sessionToInstall: safeRatio(ascUnits, gaSessions),
    searchToInstall: safeRatio(ascUnits, gscClicks),
    installToSubConversion: safeRatio(
      ascSubs?.activeSubscribers ?? 0,
      ascSummary?.units ?? 0,
    ),
    topArticles,
  };
}

/**
 * Wilson upper bound for a binomial proportion at 95% confidence.
 * Gives us "the conversion rate is at most X% given the data".
 * Used so we don't shout "BROKEN PAYWALL" on a 0/50 sample where the
 * real rate could still be 5%.
 */
function wilsonUpper95(successes: number, n: number): number {
  if (n === 0) return 1;
  const z = 1.96;
  const p = successes / n;
  const denom = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return (center + margin) / denom;
}

function buildInsights(rows: AppRow[]): Insight[] {
  const insights: Insight[] = [];

  for (const r of rows) {
    // 1. Page-level CTR / bounce / SEO-conversion checks
    //    Thresholds picked so we only fire at sample sizes where the
    //    observation is statistically meaningful, not just sample noise.

    if (r.gaSessions >= 100 && r.gaBounceRate > 0.7) {
      insights.push({
        severity: 'med',
        icon: '🟠',
        app: r.name,
        title: `${r.name}: ${(r.gaBounceRate * 100).toFixed(0)}% bounce på ${r.gaSessions} sessions`,
        detail: `Besökare lämnar utan att engagera. Antingen matchar sidan inte deras intent eller laddar långsamt.`,
        action: `Kolla i GA: var hoppar de av? Stärk värdeprop ovan vikning. Eller skriv om title/meta så fel intent inte söks.`,
      });
    }

    if (r.gscClicks >= 100 && r.searchToSession < 0.5) {
      insights.push({
        severity: 'high',
        icon: '🔴',
        app: r.name,
        title: `${r.name}: ${r.gscClicks} sökklick men bara ${r.gaSessions} sessions (${(r.searchToSession * 100).toFixed(0)}% når sidan)`,
        detail: `Massa klick i Google men få landar faktiskt på sidan. Indikerar slow load (folk avbryter), redirect-problem eller GA-tracking-bug.`,
        action: `Testa /${r.slug}/-sidan i PageSpeed Insights. Verifiera GA-trackern fungerar (öppna sidan, kolla i GA Realtime).`,
      });
    }
  }

  // 2. Subscription conversion bleeders — REQUIRE statistical confidence.
  //    Use Wilson upper bound: if even the OPTIMISTIC interpretation of
  //    the data is below 0.5%, then paywall is genuinely broken. With
  //    0/54 (Plantera) the upper bound is 6.6% — too wide to conclude
  //    anything. With 6/1958 (Födelsedagar) it's 0.66% — solid signal.
  for (const r of rows) {
    if (r.ascUnits < 100) continue; // need real sample before claiming
    const upper = wilsonUpper95(r.ascActiveSubs, r.ascUnits);
    const point = r.installToSubConversion;
    if (upper < 0.01) {
      // Even optimistic estimate is below 1% — paywall is genuinely broken
      insights.push({
        severity: 'high',
        icon: '💸',
        app: r.name,
        title: `${r.name}: ${r.ascUnits} installs → ${r.ascActiveSubs} subs (${(point * 100).toFixed(2)}%, max ${(upper * 100).toFixed(1)}% @ 95% conf)`,
        detail: `Industry benchmark för B2C-iOS-utility-apps är 1-5% install→sub. Med ditt sample-size är vi 95% säkra på att verklig rate är under ${(upper * 100).toFixed(1)}%. Paywall-problem: timing, copy, pris eller value prop.`,
        action: `Granska /lib/screens/paywall_screen.dart för ${r.slug}. Vanliga fix: visa paywall efter "wow"-moment (inte vid app-start), framhäv free trial tydligt, social proof ("X+ användare"), Apple 3.1.2(c) compliance.`,
      });
    }

    if (r.ascFreeTrials >= 10 && r.ascFreeTrials > r.ascActiveSubs * 2) {
      insights.push({
        severity: 'med',
        icon: '🎁',
        app: r.name,
        title: `${r.name}: ${r.ascFreeTrials} free trials aktiva, ${r.ascActiveSubs} betalande`,
        detail: `Du har trafik IN i trial men många konverterar inte till paid. Trial-to-paid är där 80% av prenumerations-revenue vinns eller förloras.`,
        action: `Skicka dag-5-notis ("Trial slutar om 2 dagar — så här har du använt appen"). Visa stats om vad de skulle förlora om de inte betalar.`,
      });
    }
  }

  // 3. Channel attribution + growth opportunities — top priority since
  //    the portfolio is overwhelmingly ASO/word-of-mouth driven, not SEO.
  for (const r of rows) {
    // Dead app: 0 installs AND no GSC traffic over the period
    if (r.ascUnits === 0 && r.gscClicks === 0 && r.gscImpressions < 10) {
      insights.push({
        severity: 'high',
        icon: '☠️',
        app: r.name,
        title: `${r.name}: 0 installs, ingen sök-synlighet på 28 dagar`,
        detail: `App:n syns inte i App Store-search (ASO trasig) och rankar inte i Google. Antingen indexerings-problem, fel kategoriserad, eller låg keyword-konkurrens.`,
        action: `Audit ASC: title, subtitle, keywords-fältet (100 char), screenshots-CTR. Om allt OK — kanske pivot eller ta bort.`,
      });
    }

    // ASO-dominant with high install volume — ASA scaling opportunity
    // (high installs, almost no SEO contribution)
    if (
      r.ascUnits >= 50 &&
      r.gscClicks < r.ascUnits * 0.05 &&
      r.gscImpressions < r.ascUnits * 2
    ) {
      insights.push({
        severity: 'med',
        icon: '📱',
        app: r.name,
        title: `${r.name}: ${r.ascUnits} installs nästan helt från App Store (ASO/ASA), inte SEO`,
        detail: `${r.gscClicks} sökklick + ${r.gscImpressions} impressions på 28 dagar betyder Google inte ens visar oss. Antingen rankar artiklarna för fel keywords, eller målgruppen söker bara i App Store, inte Google.`,
        action: `2 spår: (1) Skala det som funkar — testa Apple Search Ads för ${r.name} med 200 SEK/dag i 14 dagar och mät CAC. (2) Lägg om SEO-strategin: skriv "bästa X 2026"-jämförelser, inte info-artiklar. Buyer intent rankar.`,
      });
    }

    // SEO articles getting impressions but no clicks → wrong keyword
    // targeting, no ranking on page 1, OR wrong title/meta
    if (r.gscImpressions >= 500 && r.gscCtr < 0.01) {
      insights.push({
        severity: 'high',
        icon: '🎯',
        app: r.name,
        title: `${r.name}: ${r.gscImpressions} impressions, bara ${r.gscClicks} klick (${(r.gscCtr * 100).toFixed(2)}% CTR)`,
        detail: `Du syns i sökresultaten men ingen klickar. Antingen rankar du på pos 11+ (sida 2), eller title/meta sticker inte ut.`,
        action: `Drill-down per artikel: hitta de med >50 impressions men <2 klick → skriv om title med tydligt nyttovärde + årtal ("2026", "gratis", "snabb").`,
      });
    }

    // Geo-mismatch: high installs from country, no SEO traffic
    const top = r.ascTopCountries[0];
    if (top && top.cc !== 'SE' && top.units >= 10) {
      insights.push({
        severity: 'med',
        icon: '🌍',
        app: r.name,
        title: `${r.name}: ${top.units} installs från ${top.cc} — outforskad SEO-marknad`,
        detail: `App:n drar installs från ${top.cc} via ASO/word-of-mouth. Bygg ${top.cc}-content och du kan dubbla.`,
        action: `Verifiera ${r.slug} har ASC-localisation för ${top.cc}. Om ja — skriv 3-5 "bästa [app]-typen" + 2-3 problem-solving-artiklar på språket.`,
      });
    }
  }

  // 4. Portfolio-level diagnostics — the big picture story
  const totalInstalls = rows.reduce((s, r) => s + r.ascUnits, 0);
  const totalGscClicks = rows.reduce((s, r) => s + r.gscClicks, 0);
  const totalMrr = rows.reduce((s, r) => s + r.ascMrr, 0);

  // If SEO drives < 5% of total installs, the 160-article strategy isn't
  // paying back. This is the most important global insight.
  if (totalInstalls >= 100) {
    const seoShare = totalGscClicks / totalInstalls;
    if (seoShare < 0.05) {
      insights.push({
        severity: 'high',
        icon: '📉',
        title: `SEO genererar < 5% av portfolio-installs (${totalGscClicks} sökklick vs ${totalInstalls} installs)`,
        detail: `160+ artiklar producerar marginal install-volym. Antingen rankar de för info-keywords (folk vill veta, inte ladda ner), eller App Store-CTAs är osynliga ovan vikning.`,
        action: `Sluta skriv nya info-artiklar. Fokusera 100% på (a) "bästa [X]-appen 2026"-jämförelser med stora App Store-CTAs ovan vikning, och (b) skala ASA på top-ASO-apparna istället.`,
      });
    }
  }

  if (totalMrr > 0) {
    const topMrr = [...rows].sort((a, b) => b.ascMrr - a.ascMrr)[0];
    if (topMrr && topMrr.ascMrr > 0) {
      const pct = ((topMrr.ascMrr / totalMrr) * 100).toFixed(0);
      insights.push({
        severity: 'low',
        icon: '💰',
        title: `${topMrr.name} står för ${pct}% av total MRR (${topMrr.ascMrr.toFixed(0)} ${topMrr.ascMrrCurrency})`,
        detail: `Total MRR portfölj: ${totalMrr.toFixed(0)} ${topMrr.ascMrrCurrency}. ${topMrr.ascActiveSubs} betalande prenumeranter på ${topMrr.name}. Single point of failure — om ${topMrr.name} har en dålig vecka tappar du nästan hela revenue.`,
        action: `Två-spårsstrategi: (1) Fördubbla install→sub-rate på ${topMrr.name} (störst hävstång idag). (2) Bygg en till app till MRR-paritet för diversifiering.`,
      });
    }
  } else if (totalInstalls > 0) {
    insights.push({
      severity: 'high',
      icon: '🚨',
      title: `${totalInstalls} installs på 28 dagar men 0 SEK MRR`,
      detail: `Hela portfolion drar trafik men ingen konverterar till betald. Antingen är paywall trasig på alla appar, eller IAP-konfiguration har problem.`,
      action: `Börja med top-install-appen, granska paywall-flödet i sandbox-konto. Vanliga problem: paywall visas aldrig, IAP-products laddas inte, free-trial visas inte tydligt.`,
    });
  }

  // Sort by severity (high → low)
  const sevOrder = { high: 0, med: 1, low: 2 };
  insights.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  return insights;
}

export const POST: APIRoute = async ({ request }) => {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  let body: { days?: number } = {};
  try {
    body = await request.json();
  } catch {
    /* default to {} */
  }
  const days = Math.max(7, Math.min(90, body.days ?? 30));
  const range = dateRange(days);

  try {
    // Load website app configs (used to map page slugs → bundleIds)
    const appsCollection = await getCollection('apps');
    // Pure GCP project doesn't have Firebase or anything Astro-specific
    // — Astro provides slug as `id` for content collections.
    const appCfgs = appsCollection
      .filter((a) => a.data.status === 'live')
      .map((a) => ({
        slug: a.id as string,
        name: a.data.name as string,
        bundleId: (a.data.bundleId as string) || '',
        appStoreUrl: (a.data.appStoreUrl as string) || '',
      }));

    // Fetch the three data sources in parallel.
    const gaStartDate = new Date(Date.now() - days * 86400_000);
    const gaEndDate = new Date();

    const [gscRows, gaResp, ascAppsList] = await Promise.allSettled([
      querySearchAnalytics({
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: ['page'],
        rowLimit: 250,
      }),
      ga4RunReport({
        dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 250,
      }),
      listApps(),
    ]);

    // Don't fail completely if one source is down — degrade gracefully.
    const gscData =
      gscRows.status === 'fulfilled' ? gscRows.value : [];
    const gaPages =
      gaResp.status === 'fulfilled'
        ? gaResp.value.rows.map((r) => ({
            page: r.dimensionValues[0].value,
            sessions: Number(r.metricValues[0].value),
            users: Number(r.metricValues[1].value),
            bounceRate: Number(r.metricValues[2].value),
          }))
        : [];
    const ascApps = ascAppsList.status === 'fulfilled' ? ascAppsList.value : [];

    // ASC sales — only fetch if we successfully listed apps. The
    // listApps() call validates ASC auth works.
    let ascSummaries: AppSalesSummary[] = [];
    let salesRange: {
      start: string;
      end: string;
      rowCount: number;
      daysFetched: number;
      daysSkipped: number;
      firstError: string | null;
    } | null = null;
    if (ascApps.length > 0) {
      try {
        const sales = await fetchSalesRange(gaStartDate, gaEndDate);
        ascSummaries = summarizeByApp(sales.rows);
        salesRange = {
          start: range.startDate,
          end: range.endDate,
          rowCount: sales.rows.length,
          daysFetched: sales.daysFetched,
          daysSkipped: sales.daysSkipped,
          firstError: sales.firstError,
        };
      } catch (e) {
        console.warn('[seo-expert] ASC sales fetch failed:', e);
      }
    }

    // ASC subscriptions — snapshot of active subscribers as of latest
    // day Apple has published. This is where revenue lives for our apps.
    let subsByAppId: Map<string, AppSubscriptionSummary> = new Map();
    let subsDate: string | null = null;
    let subsRowCount = 0;
    if (ascApps.length > 0) {
      try {
        const latest = await fetchLatestSubscriptions();
        subsDate = latest.date;
        subsRowCount = latest.rows.length;
        subsByAppId = summarizeSubscriptionsByApp(latest.rows);
      } catch (e) {
        console.warn('[seo-expert] ASC subscriptions fetch failed:', e);
      }
    }

    // bundleId → ASC SKU map (sales reports are keyed by SKU, not bundleId)
    // bundleId → numeric Apple ID (subscription reports use that)
    const bundleToSku = new Map<string, string>();
    const bundleToAppleId = new Map<string, string>();
    for (const a of ascApps) {
      bundleToSku.set(a.bundleId, a.sku);
      bundleToAppleId.set(a.bundleId, a.id);
    }

    // Combine into one row per website app
    const appRows: AppRow[] = appCfgs.map((cfg) => {
      const sku = bundleToSku.get(cfg.bundleId);
      const ascSummary = sku
        ? ascSummaries.find((s) => s.sku === sku) ?? null
        : null;
      const appleId = bundleToAppleId.get(cfg.bundleId);
      const ascSubs = appleId ? subsByAppId.get(appleId) ?? null : null;
      return buildAppRow(
        cfg.slug,
        cfg.name,
        cfg.bundleId,
        gscData,
        gaPages,
        ascSummary,
        ascSubs,
      );
    });

    appRows.sort((a, b) => b.gscClicks + b.gaSessions - (a.gscClicks + a.gaSessions));

    return json({
      range: { ...range, days },
      sources: {
        gsc: { ok: gscRows.status === 'fulfilled', error: gscRows.status === 'rejected' ? String(gscRows.reason) : null, rowCount: gscData.length },
        ga4: { ok: gaResp.status === 'fulfilled', error: gaResp.status === 'rejected' ? String(gaResp.reason) : null, rowCount: gaPages.length },
        asc: {
          ok: ascAppsList.status === 'fulfilled',
          error: ascAppsList.status === 'rejected' ? String(ascAppsList.reason) : null,
          appCount: ascApps.length,
          salesRange,
          subscriptions: { date: subsDate, rowCount: subsRowCount },
        },
      },
      apps: appRows,
      insights: buildInsights(appRows),
    });
  } catch (e) {
    console.error('seo-expert error:', e);
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      500,
    );
  }
};
