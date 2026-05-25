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

function buildInsights(rows: AppRow[]): Insight[] {
  const insights: Insight[] = [];

  for (const r of rows) {
    // 1. App with strong SEO but weak conversion to install
    if (r.gscClicks >= 30 && r.ascUnits > 0 && r.searchToInstall < 0.05) {
      insights.push({
        severity: 'high',
        icon: '🔴',
        app: r.name,
        title: `${r.name}: ${r.gscClicks} sökklick → bara ${r.ascUnits} installs (${(r.searchToInstall * 100).toFixed(0)}% conversion)`,
        detail: `Sidan rankar och drar trafik, men få konverterar till App Store-nedladdning. Antingen är intent fel (söker info, inte appen) eller CTA till App Store är otydlig.`,
        action: `Granska /${r.slug}/-sidan: är "Ladda ner"-knappen above the fold? Adresserar texten direkt det användaren sökte efter?`,
      });
    }

    // 2. App with traffic but high bounce
    if (r.gaSessions >= 50 && r.gaBounceRate > 0.7) {
      insights.push({
        severity: 'med',
        icon: '🟠',
        app: r.name,
        title: `${r.name}: ${(r.gaBounceRate * 100).toFixed(0)}% bounce på ${r.gaSessions} sessions`,
        detail: `Besökare lämnar utan att engagera. Antingen matchar sidan inte deras intent eller laddar långsamt.`,
        action: `Kolla i GA: var hoppar de av? Stärk värdeprop ovan vikning. Eller skriv om title/meta så fel intent inte söks.`,
      });
    }

    // 3. GSC → GA loss (most visitors don't load the page after clicking)
    if (r.gscClicks >= 50 && r.searchToSession < 0.5) {
      insights.push({
        severity: 'high',
        icon: '🔴',
        app: r.name,
        title: `${r.name}: ${r.gscClicks} sökklick men bara ${r.gaSessions} sessions (${(r.searchToSession * 100).toFixed(0)}% når sidan)`,
        detail: `Massa klick i Google men få landar faktiskt på sidan. Indikerar slow load (folk avbryter), redirect-problem eller GA-tracking-bug.`,
        action: `Testa /${r.slug}/-sidan i PageSpeed Insights. Verifiera GA-trackern fungerar (öppna sidan, kolla i GA Realtime).`,
      });
    }

    // 4. ASC installs without proportional SEO
    if (r.ascUnits >= 10 && r.gscClicks < r.ascUnits * 0.2) {
      insights.push({
        severity: 'med',
        icon: '👻',
        app: r.name,
        title: `${r.name}: ${r.ascUnits} installs men bara ${r.gscClicks} sökklick`,
        detail: `Installs kommer från icke-SEO-kanaler (App Store search, ASA-ads, word-of-mouth, in-app cross-promo). Stor SEO-uppside.`,
        action: `Bygg fler SEO-artiklar för /${r.slug}/. Varje sökord du tar rank på kan multiplicera nuvarande icke-SEO-installs.`,
      });
    }

    // 5. Winners — keep + scale
    if (r.gscClicks >= 50 && r.searchToInstall > 0.15) {
      insights.push({
        severity: 'low',
        icon: '🟢',
        app: r.name,
        title: `${r.name}: ${(r.searchToInstall * 100).toFixed(0)}% sök→install — guldlandning`,
        detail: `${r.gscClicks} klick → ${r.ascUnits} installs. Sidan funkar.`,
        action: `Använd /${r.slug}/ som mall för svagare app-sidor. Skriv mer content för samma sökord-cluster.`,
      });
    }

    // 6. Geo-mismatch: high installs from country, no SEO traffic
    const seOnly = r.ascTopCountries[0];
    if (seOnly && seOnly.cc !== 'SE' && seOnly.units >= 5) {
      // App is doing well in a non-Swedish country
      insights.push({
        severity: 'med',
        icon: '🌍',
        app: r.name,
        title: `${r.name}: ${seOnly.units} installs från ${seOnly.cc} — kanske värt fler ${seOnly.cc}-artiklar?`,
        detail: `App:n drar installs från ${seOnly.cc} utan att vi har särskild SEO där. Ranking-möjlighet om vi gör översatt content.`,
        action: `Kolla om ${r.slug} har ASC-localisation för ${seOnly.cc}. Om ja — skriv 2-3 artiklar på det språket.`,
      });
    }
  }

  // 7. Subscription conversion bleeders (CORE metric — this is revenue)
  for (const r of rows) {
    // Many installs, very few subs → paywall problem
    if (r.ascUnits >= 50 && r.installToSubConversion < 0.005 && r.ascActiveSubs >= 0) {
      insights.push({
        severity: 'high',
        icon: '💸',
        app: r.name,
        title: `${r.name}: ${r.ascUnits} installs → bara ${r.ascActiveSubs} prenumeranter (${(r.installToSubConversion * 100).toFixed(2)}%)`,
        detail: `Industry benchmark för B2C-iOS-utility-apps är 1-5% install→sub. Under 0.5% indikerar paywall-problem: timing, copy, pris eller value prop.`,
        action: `Granska /lib/screens/paywall_screen.dart för ${r.slug}. Vanliga fix: visa paywall efter "wow"-moment (inte vid app-start), framhäv free trial tydligt, social proof ("X+ användare"), Apple 3.1.2(c) compliance.`,
      });
    }
    // Strong free trial uptake — focus on trial-to-paid conversion
    if (r.ascFreeTrials >= 5 && r.ascFreeTrials > r.ascActiveSubs * 2) {
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

  // 8. Portfolio-level: MRR distribution
  const totalMrr = rows.reduce((s, r) => s + r.ascMrr, 0);
  if (totalMrr > 0) {
    const topMrr = [...rows].sort((a, b) => b.ascMrr - a.ascMrr)[0];
    if (topMrr && topMrr.ascMrr > 0) {
      const pct = ((topMrr.ascMrr / totalMrr) * 100).toFixed(0);
      insights.push({
        severity: 'low',
        icon: '💰',
        title: `${topMrr.name} står för ${pct}% av total MRR (${topMrr.ascMrr.toFixed(0)} ${topMrr.ascMrrCurrency})`,
        detail: `Total MRR portfölj: ${totalMrr.toFixed(0)} ${topMrr.ascMrrCurrency}. ${topMrr.ascActiveSubs} betalande prenumeranter på ${topMrr.name}.`,
        action: `Diversifiering: bygg en till app till MRR-paritet eller dubblera ner på ${topMrr.name}.`,
      });
    }
  } else {
    insights.push({
      severity: 'med',
      icon: '🤔',
      title: 'Ingen MRR registrerad ännu',
      detail: 'Antingen har du noll betalande prenumeranter, eller så har Apple inte hunnit publicera senaste Subscription-rapporten (1-2 dagars delay).',
      action: 'Verifiera manuellt: ASC → Sales and Trends → Subscriptions. Om noll: granska paywalls (timing, free trial, prissättning).',
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
