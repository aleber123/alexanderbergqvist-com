/**
 * ASC Trends API — historical sales trends across the full app portfolio.
 *
 * Pulls 12 months of MONTHLY SALES SUMMARY reports + the last 30 days
 * of DAILY SALES SUMMARY, aggregates per-app + per-month, computes a
 * geometric-mean MoM growth rate, and surfaces forecast-ready insights.
 *
 * The existing /api/admin/seo-expert endpoint already shows current
 * snapshot data. This one is purely historical — answers "are we
 * growing, which apps, how fast" rather than "what's selling right now".
 *
 * POST /api/admin/asc-trends
 * Body: { months?: number (default 12), recentDays?: number (default 30) }
 *
 * Auth: same x-admin-password header as the other admin endpoints.
 *
 * Cost: one ASC API call per month + one per day in `recentDays`. With
 * defaults that's ~42 calls, ~5-10 seconds end-to-end. Vercel function
 * default timeout is 10s — kept the windows tight enough to fit.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { json, requireAdminAuth } from '../../../lib/google-api';
import {
  fetchMonthlyRange,
  fetchSalesRange,
  growthRate,
  PTI_DOWNLOAD,
  PTI_IAP_NEW,
  PTI_IAP_RENEW,
  summarizeMonthlyTrend,
  type SalesRow,
} from '../../../lib/asc';

export const prerender = false;

interface TrendAppRow {
  sku: string;
  appName: string;
  // 12-month totals
  downloads12m: number;
  iapNew12m: number;
  iapRenew12m: number;
  proceeds12m: number;
  currency: string;
  // Monthly download cells — same order as `months` in the envelope
  downloadsByMonth: number[];
  proceedsByMonth: number[];
  // Last-30d totals (from daily range, PTI-aware)
  downloads30d: number;
  iapNew30d: number;
  iapRenew30d: number;
  proceeds30d: number;
  // Derived
  /** Geometric-mean MoM unit-growth multiplier, e.g. 1.15 = +15%/mån. Null if <2 months of data. */
  growthMom: number | null;
  /** Last month vs avg of prior months (1 = flat). */
  trendVsAvg: number | null;
  /** IAP first-buys / downloads — the conversion rate that matters. */
  conversionRate: number | null;
}

interface TrendEnvelope {
  ok: true;
  /** Sorted YYYY-MM strings, oldest first. */
  months: string[];
  monthsFetched: number;
  monthsSkipped: number;
  daysFetched: number;
  daysSkipped: number;
  totals: {
    downloads12m: number;
    downloads30d: number;
    proceedsByCurrency: Record<string, number>;
  };
  apps: TrendAppRow[];
  insights: {
    growing: { sku: string; appName: string; recent: number; priorAvg: number }[];
    declining: { sku: string; appName: string; recent: number; priorAvg: number }[];
    /** Top earner by 12-month proceeds in the dominant currency. */
    topEarner: { sku: string; appName: string; proceeds: number; currency: string } | null;
    /** App with the highest growthMom (>= 1.1) — momentum candidate. */
    fastestGrowing: { sku: string; appName: string; growthMom: number } | null;
    /** Apps with best conversion (IAP first / downloads) — these are the
     *  ones where the paywall actually works and just need more traffic. */
    bestConversion: { sku: string; appName: string; rate: number; downloads: number }[];
  };
  warnings: string[];
}

/** Per-SKU PTI-aware totals for a range of daily SalesRows. */
function recentTotalsBySku(rows: SalesRow[]): Map<
  string,
  {
    sku: string;
    appName: string;
    downloads: number;
    iapNew: number;
    iapRenew: number;
    proceeds: number;
    currency: string;
  }
> {
  const map = new Map<
    string,
    {
      sku: string;
      appName: string;
      downloads: number;
      iapNew: number;
      iapRenew: number;
      proceeds: number;
      currency: string;
    }
  >();
  for (const r of rows) {
    let t = map.get(r.sku);
    if (!t) {
      t = {
        sku: r.sku,
        appName: r.appName,
        downloads: 0,
        iapNew: 0,
        iapRenew: 0,
        proceeds: 0,
        currency: r.currency,
      };
      map.set(r.sku, t);
    }
    t.appName = r.appName;
    if (PTI_DOWNLOAD.has(r.pti)) {
      t.downloads += r.units;
    } else if (PTI_IAP_NEW.has(r.pti) || PTI_IAP_RENEW.has(r.pti)) {
      const rowProceeds = r.units * r.proceeds;
      if (PTI_IAP_NEW.has(r.pti)) t.iapNew += r.units;
      else t.iapRenew += r.units;
      t.proceeds += rowProceeds;
      if (rowProceeds > 0) t.currency = r.currency;
    }
  }
  return map;
}

export const POST: APIRoute = async ({ request }) => {
  const authFail = requireAdminAuth(request);
  if (authFail) return authFail;

  let body: { months?: number; recentDays?: number };
  try {
    body = (await request.json()) as { months?: number; recentDays?: number };
  } catch {
    body = {};
  }
  const months = Math.max(1, Math.min(24, body.months ?? 12));
  const recentDays = Math.max(1, Math.min(90, body.recentDays ?? 30));

  const warnings: string[] = [];

  // ─── Build IAP-SKU → app-SKU rollup map from website app configs.
  // IAP rows in the SALES report carry the IAP product ID as SKU (e.g.
  // "com.alexanderbergqvist.birthdayreminder.forever"), not the parent
  // app's SKU. Without this lookup, the conversion-rate insight reads
  // 0% for every app and the proceeds show up under a phantom "Lifetime"
  // app instead of the actual app it belongs to.
  const appsCollection = await getCollection('apps');
  // Build bundleId → app display name from the website's content
  // collection. The display name is what Apple writes into the SALES
  // report's "Title" column for both the app row AND its IAP-product
  // rows, so this lets us walk: IAP-SKU → bundle (prefix match) →
  // content name → parent app row (name match against SALES Title).
  const bundleToContentName = new Map<string, string>();
  for (const a of appsCollection) {
    const bundle = a.data.bundleId as string | undefined;
    const name = a.data.name as string | undefined;
    if (bundle && name) bundleToContentName.set(bundle, name);
  }

  // ─── Monthly pull
  const monthly = await fetchMonthlyRange(months);
  if (monthly.firstError) warnings.push(`monthly: ${monthly.firstError}`);
  const trend = summarizeMonthlyTrend(monthly.rows);

  // ─── Daily pull for last `recentDays`
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1); // yesterday — today usually 404s
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (recentDays - 1));
  const daily = await fetchSalesRange(start, end);
  if (daily.firstError) warnings.push(`daily: ${daily.firstError}`);
  const recentBySku = recentTotalsBySku(daily.rows);

  // ─── Stitch per-app rows: monthly trend cells + recent totals
  const apps: TrendAppRow[] = trend.apps.map((series) => {
    const recent = recentBySku.get(series.sku);
    const growth = growthRate(series, trend.months);
    // trendVsAvg: last month vs avg of prior months with data
    const monthlyVals = trend.months
      .map((m) => series.downloadsByMonth[m])
      .filter((v): v is number => v != null && v > 0);
    let trendVsAvg: number | null = null;
    if (monthlyVals.length >= 2) {
      const last = monthlyVals[monthlyVals.length - 1];
      const prior = monthlyVals.slice(0, -1);
      const avg = prior.reduce((s, v) => s + v, 0) / prior.length;
      trendVsAvg = avg > 0 ? last / avg : null;
    }
    const conversionRate =
      series.totalDownloads > 0
        ? series.totalIapNew / series.totalDownloads
        : null;
    return {
      sku: series.sku,
      appName: series.appName,
      downloads12m: series.totalDownloads,
      iapNew12m: series.totalIapNew,
      iapRenew12m: series.totalIapRenew,
      proceeds12m: series.totalProceeds,
      currency: series.currency,
      downloadsByMonth: trend.months.map(
        (m) => series.downloadsByMonth[m] ?? 0,
      ),
      proceedsByMonth: trend.months.map(
        (m) => series.proceedsByMonth[m] ?? 0,
      ),
      downloads30d: recent?.downloads ?? 0,
      iapNew30d: recent?.iapNew ?? 0,
      iapRenew30d: recent?.iapRenew ?? 0,
      proceeds30d: recent?.proceeds ?? 0,
      growthMom: growth,
      trendVsAvg,
      conversionRate,
    };
  });

  // Apps that appear only in the 30d window (launched after monthly window
  // ended) won't be in `trend.apps`. Add them so the recent column is
  // complete — they just have empty monthly cells.
  for (const [sku, r] of recentBySku) {
    if (apps.some((a) => a.sku === sku)) continue;
    apps.push({
      sku,
      appName: r.appName,
      downloads12m: 0,
      iapNew12m: 0,
      iapRenew12m: 0,
      proceeds12m: 0,
      currency: r.currency,
      downloadsByMonth: trend.months.map(() => 0),
      proceedsByMonth: trend.months.map(() => 0),
      downloads30d: r.downloads,
      iapNew30d: r.iapNew,
      iapRenew30d: r.iapRenew,
      proceeds30d: r.proceeds,
      growthMom: null,
      trendVsAvg: null,
      conversionRate:
        r.downloads > 0 ? r.iapNew / r.downloads : null,
    });
  }
  // ─── Roll IAP-product rows into their parent app.
  //
  // IAP rows in the SALES report carry the IAP product ID as SKU (e.g.
  // "com.alexanderbergqvist.birthdayreminder.forever") rather than the
  // app's own SKU (e.g. "birthdayreminder001"). Without merging, the
  // app row shows downloads but zero conversion, and the proceeds get
  // stranded under phantom "Lifetime"/"Yearly"/"Monthly" entries.
  //
  // Match by `bundleId-as-SKU-prefix`: every IAP we ship has its
  // product ID prefixed with the parent app's bundleId, and we know the
  // bundleIds from the website's app content collection.
  //
  // Once the parent app is identified, we roll iapNew/iapRenew/proceeds
  // into it and drop the IAP row from the per-app list.
  const sortedBundles = Array.from(bundleToContentName.keys()).sort(
    (a, b) => b.length - a.length, // longest first so deeper bundles win
  );
  // Build: bundleId → parent-app row. We look up the app row by matching
  // SALES "Title" column against the content collection's display name
  // (case-insensitive, since Apple sometimes capitalizes differently).
  const bundleToParent = new Map<string, TrendAppRow>();
  for (const bundle of sortedBundles) {
    const expectedName = bundleToContentName.get(bundle);
    if (!expectedName) continue;
    const want = expectedName.toLowerCase().trim();
    const parent = apps.find(
      (a) =>
        !a.sku.startsWith(bundle) && // skip the IAP product rows themselves
        (a.downloads12m > 0 || a.downloads30d > 0) &&
        (a.appName.toLowerCase().trim() === want ||
          a.appName.toLowerCase().startsWith(want + ' ') ||
          a.appName.toLowerCase().startsWith(want + ':')),
    );
    if (parent) bundleToParent.set(bundle, parent);
  }

  const removeSkus = new Set<string>();
  for (const a of apps) {
    if (a.downloads12m > 0 || a.downloads30d > 0) continue;
    if (a.iapNew12m + a.iapRenew12m + a.iapNew30d + a.iapRenew30d === 0) continue;
    const bundle = sortedBundles.find((b) => a.sku.startsWith(b));
    if (!bundle) continue;
    const parent = bundleToParent.get(bundle);
    if (!parent) continue;
    parent.iapNew12m += a.iapNew12m;
    parent.iapRenew12m += a.iapRenew12m;
    parent.iapNew30d += a.iapNew30d;
    parent.iapRenew30d += a.iapRenew30d;
    parent.proceeds12m += a.proceeds12m;
    parent.proceeds30d += a.proceeds30d;
    if (a.currency && (!parent.currency || parent.currency === 'USD')) {
      parent.currency = a.currency;
    }
    parent.conversionRate =
      parent.downloads12m > 0
        ? parent.iapNew12m / parent.downloads12m
        : null;
    removeSkus.add(a.sku);
  }
  const appsRolled = apps.filter((a) => !removeSkus.has(a.sku));
  appsRolled.sort((a, b) => b.downloads30d - a.downloads30d);

  // ─── Totals (only count IAP-related proceeds — exclude noise)
  const proceedsByCurrency: Record<string, number> = {};
  for (const r of monthly.rows) {
    if (PTI_IAP_NEW.has(r.pti) || PTI_IAP_RENEW.has(r.pti)) {
      proceedsByCurrency[r.currency] =
        (proceedsByCurrency[r.currency] ?? 0) + r.units * r.proceeds;
    }
  }

  // ─── Insights (compute against the rolled-up app list)
  const growing: TrendEnvelope['insights']['growing'] = [];
  const declining: TrendEnvelope['insights']['declining'] = [];
  for (const a of appsRolled) {
    if (a.trendVsAvg == null) continue;
    const monthlyVals = a.downloadsByMonth.filter((v) => v > 0);
    if (monthlyVals.length < 2) continue;
    const last = monthlyVals[monthlyVals.length - 1];
    const priorAvg =
      monthlyVals.slice(0, -1).reduce((s, v) => s + v, 0) /
      Math.max(1, monthlyVals.length - 1);
    if (priorAvg < 5) continue; // too noisy below this
    if (a.trendVsAvg >= 1.5) {
      growing.push({ sku: a.sku, appName: a.appName, recent: last, priorAvg });
    } else if (a.trendVsAvg <= 0.5) {
      declining.push({ sku: a.sku, appName: a.appName, recent: last, priorAvg });
    }
  }

  let topEarner: TrendEnvelope['insights']['topEarner'] = null;
  for (const a of appsRolled) {
    if (a.proceeds12m <= 0) continue;
    if (!topEarner || a.proceeds12m > topEarner.proceeds) {
      topEarner = { sku: a.sku, appName: a.appName, proceeds: a.proceeds12m, currency: a.currency };
    }
  }

  let fastestGrowing: TrendEnvelope['insights']['fastestGrowing'] = null;
  for (const a of appsRolled) {
    if (a.growthMom == null || a.growthMom < 1.1) continue;
    if (a.downloads12m < 20) continue; // ignore noise
    if (!fastestGrowing || a.growthMom > fastestGrowing.growthMom) {
      fastestGrowing = { sku: a.sku, appName: a.appName, growthMom: a.growthMom };
    }
  }

  // Best conversion = paywall works, just needs more traffic. Need ≥10
  // downloads + ≥1 IAP first-buy to count as a signal vs noise.
  const bestConversion = appsRolled
    .filter(
      (a) =>
        a.conversionRate != null &&
        a.downloads12m + a.downloads30d >= 10 &&
        a.iapNew12m + a.iapNew30d >= 1,
    )
    .map((a) => {
      const dl = a.downloads12m + a.downloads30d;
      const iap = a.iapNew12m + a.iapNew30d;
      return {
        sku: a.sku,
        appName: a.appName,
        rate: iap / dl,
        downloads: dl,
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  const env: TrendEnvelope = {
    ok: true,
    months: trend.months,
    monthsFetched: monthly.monthsFetched,
    monthsSkipped: monthly.monthsSkipped,
    daysFetched: daily.daysFetched,
    daysSkipped: daily.daysSkipped,
    totals: {
      downloads12m: appsRolled.reduce((s, a) => s + a.downloads12m, 0),
      downloads30d: appsRolled.reduce((s, a) => s + a.downloads30d, 0),
      proceedsByCurrency,
    },
    apps: appsRolled,
    insights: { growing, declining, topEarner, fastestGrowing, bestConversion },
    warnings,
  };
  return json(env);
};
