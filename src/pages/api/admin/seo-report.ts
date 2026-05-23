/**
 * SEO Report API — Google Search Console + GA4 proxy for
 * alexanderbergqvist.com. Modeled after the doxvl.se admin/seo-report
 * endpoint but slimmer — no Firestore cross-reference, just raw GSC +
 * GA4 data with insight-generation on top.
 *
 * POST /api/admin/seo-report
 * Body: {
 *   type: 'queries' | 'pages' | 'page-queries' | 'ga-channels' | 'ga-pages',
 *   days?: number (default 30),
 *   page?: string  (URL filter for 'page-queries')
 *   limit?: number (default 25)
 * }
 *
 * Auth: ADMIN_PASSWORD env var must be set; client sends it in
 * `x-admin-password` header. Keep it long/random.
 *
 * Google auth: GOOGLE_SERVICE_ACCOUNT_JSON env var (full JSON of the
 * service account key as a string). Service account must be added as:
 *   - Restricted user on the alexanderbergqvist.com Search Console property
 *   - Viewer on the GA4 property (id in PUBLIC_GA_PROPERTY_ID)
 * In local dev, falls back to ./service-account.json (gitignored).
 */

import type { APIRoute } from 'astro';
import { GoogleAuth } from 'google-auth-library';

export const prerender = false;

// Tried in order — Search Console requires the exact property ID,
// which depends on how the property was verified. Domain properties
// use `sc-domain:` prefix, URL prefix properties use the full URL.
// We auto-detect on first call by listing sites the SA has access to.
const SITE_CANDIDATES = [
  'sc-domain:alexanderbergqvist.com',
  'https://alexanderbergqvist.com/',
];
let resolvedSiteUrl: string | null = null;

async function resolveSiteUrl(): Promise<string> {
  if (resolvedSiteUrl) return resolvedSiteUrl;
  const token = await getAccessToken();
  const res = await fetch(
    'https://searchconsole.googleapis.com/webmasters/v3/sites',
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) {
    throw new Error(
      `Search Console sites list failed (${res.status}): ${await res.text()}`,
    );
  }
  const data = (await res.json()) as {
    siteEntry?: { siteUrl: string; permissionLevel: string }[];
  };
  const sites = data.siteEntry || [];
  if (sites.length === 0) {
    const creds = getCreds();
    const saEmail = creds?.client_email || 'unknown SA';
    throw new Error(
      `Service account "${saEmail}" har inga GSC-properties. ` +
        `Lägg till SA:n som Restricted user på alexanderbergqvist.com ` +
        `i Search Console → Settings → Users and Permissions. ` +
        `Vänta sedan 5-10 min och försök igen.`,
    );
  }
  const match = SITE_CANDIDATES.find((c) =>
    sites.some((s) => s.siteUrl === c),
  );
  if (!match) {
    throw new Error(
      `Inget matchande property för alexanderbergqvist.com. ` +
        `SA:n har bara access till: ${sites.map((s) => s.siteUrl).join(', ')}. ` +
        `Lägg till alexanderbergqvist.com-propertyn i Search Console.`,
    );
  }
  resolvedSiteUrl = match;
  console.log(
    `[seo-report] resolved site URL: ${resolvedSiteUrl} (SA: ${sites.length} sites total)`,
  );
  return resolvedSiteUrl;
}

// GA4 property ID. Read from env so the same code works without code
// changes if we ever migrate properties. Set GA_PROPERTY_ID in Vercel.
const GA4_PROPERTY_ID = process.env.GA_PROPERTY_ID;

// ─── Auth ──────────────────────────────────────────────────────────────

function getCreds(): any | null {
  const jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON', e);
      return null;
    }
  }
  return null;
}

async function getAccessToken(
  scope: string = 'https://www.googleapis.com/auth/webmasters.readonly',
): Promise<string> {
  const creds = getCreds();
  const auth = creds
    ? new GoogleAuth({ credentials: creds, scopes: [scope] })
    : new GoogleAuth({
        // Local-dev fallback. service-account.json must be in repo root
        // and gitignored.
        keyFilename: 'service-account.json',
        scopes: [scope],
      });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  if (!tokenResponse.token) throw new Error('Failed to get access token');
  return tokenResponse.token;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ─── Search Console ────────────────────────────────────────────────────

interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function querySearchAnalytics(opts: {
  startDate: string;
  endDate: string;
  dimensions: string[];
  rowLimit: number;
  pageFilter?: string;
}): Promise<SearchAnalyticsRow[]> {
  const token = await getAccessToken();
  const body: Record<string, unknown> = {
    startDate: opts.startDate,
    endDate: opts.endDate,
    dimensions: opts.dimensions,
    rowLimit: opts.rowLimit,
  };
  if (opts.pageFilter) {
    body.dimensionFilterGroups = [
      {
        filters: [
          { dimension: 'page', operator: 'equals', expression: opts.pageFilter },
        ],
      },
    ];
  }
  const siteUrl = await resolveSiteUrl();
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search Console API ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { rows?: SearchAnalyticsRow[] };
  return data.rows || [];
}

// ─── GA4 ───────────────────────────────────────────────────────────────

interface Ga4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

async function ga4RunReport(body: unknown): Promise<{ rows: Ga4Row[] }> {
  if (!GA4_PROPERTY_ID) {
    throw new Error('GA_PROPERTY_ID env var is not set');
  }
  const token = await getAccessToken(
    'https://www.googleapis.com/auth/analytics.readonly',
  );
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA4 Data API ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { rows?: Ga4Row[] };
  return { rows: data.rows || [] };
}

// ─── Insight generation ────────────────────────────────────────────────

interface Insight {
  severity: 'high' | 'med' | 'low';
  icon: string;
  title: string;
  detail: string;
  action?: string;
}

// Rough CTR-by-position benchmarks from public Google studies. Anything
// well below this for its position = title/meta candidate.
function expectedCtrForPosition(pos: number): number {
  if (pos < 2) return 0.3;
  if (pos < 4) return 0.15;
  if (pos < 6) return 0.08;
  if (pos < 11) return 0.04;
  if (pos < 21) return 0.015;
  return 0.005;
}

function buildQueryInsights(rows: SearchAnalyticsRow[]): Insight[] {
  const insights: Insight[] = [];

  const bleeding = rows
    .filter(
      (r) =>
        r.impressions >= 30 &&
        r.position < 30 &&
        r.ctr < expectedCtrForPosition(r.position) * 0.3,
    )
    .slice(0, 5);
  for (const r of bleeding) {
    insights.push({
      severity: 'high',
      icon: '🔴',
      title: `"${r.keys[0]}" — ${r.impressions} exp, ${r.clicks} klick @ pos ${r.position.toFixed(0)}`,
      detail: `Förväntad CTR vid pos ${r.position.toFixed(0)} är ~${(expectedCtrForPosition(r.position) * 100).toFixed(0)}%, du har ${(r.ctr * 100).toFixed(1)}%.`,
      action:
        'Skriv om titel/meta så söktermen ingår tydligt och adderar nyttovärde (gratis, ladda ner, etc.).',
    });
  }

  const climbers = rows
    .filter(
      (r) =>
        r.position >= 11 && r.position < 21 && r.impressions >= 20 && r.ctr > 0.01,
    )
    .slice(0, 3);
  for (const r of climbers) {
    insights.push({
      severity: 'med',
      icon: '📈',
      title: `"${r.keys[0]}" — pos ${r.position.toFixed(0)} (sida 2)`,
      detail: `${r.impressions} exp, ${(r.ctr * 100).toFixed(1)}% CTR. Att klättra till sida 1 skulle 3-5×:a klicken.`,
      action:
        'Lägg till mer djupinnehåll, stärk internlänkning, addera FAQ kring söktermen.',
    });
  }

  const winners = rows
    .filter((r) => r.position < 5 && r.ctr > 0.05 && r.clicks >= 2)
    .slice(0, 3);
  for (const r of winners) {
    insights.push({
      severity: 'low',
      icon: '🟢',
      title: `"${r.keys[0]}" rankar väl — pos ${r.position.toFixed(0)}, ${(r.ctr * 100).toFixed(0)}% CTR`,
      detail: `${r.clicks} klick. Behåll och bygg ut sidan — använd som mall för svagare termer.`,
    });
  }

  return insights;
}

function buildPageInsights(rows: SearchAnalyticsRow[]): Insight[] {
  const insights: Insight[] = [];

  const bleeding = rows
    .filter(
      (r) =>
        r.impressions >= 100 && r.ctr < expectedCtrForPosition(r.position) * 0.3,
    )
    .slice(0, 5);
  for (const r of bleeding) {
    const url = r.keys[0].replace('https://alexanderbergqvist.com', '');
    insights.push({
      severity: 'high',
      icon: '🔴',
      title: `${url} — ${r.impressions} exp, ${r.clicks} klick @ pos ${r.position.toFixed(0)}`,
      detail: `CTR ${(r.ctr * 100).toFixed(2)}% mot förväntat ${(expectedCtrForPosition(r.position) * 100).toFixed(0)}%.`,
      action: `Skriv om title + meta description. Kör "Söktermer per sida" för ${url} för att se intent.`,
    });
  }

  const page1Bad = rows
    .filter((r) => r.position < 10 && r.impressions >= 50 && r.ctr < 0.02)
    .slice(0, 3);
  for (const r of page1Bad) {
    const url = r.keys[0].replace('https://alexanderbergqvist.com', '');
    insights.push({
      severity: 'high',
      icon: '🟠',
      title: `${url} — sida 1 (pos ${r.position.toFixed(0)}) men ${(r.ctr * 100).toFixed(1)}% CTR`,
      detail: 'Hög ranking men snippet drar inte. Användare scrollar förbi.',
      action: 'Title rewrite med tydlig nytta + action ("Ladda ner gratis", etc.).',
    });
  }

  return insights;
}

// ─── Handler ───────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return json({ error: 'ADMIN_PASSWORD not configured on server' }, 500);
  }
  const headerPwd = request.headers.get('x-admin-password');
  if (headerPwd !== adminPassword) {
    return json({ error: 'unauthorized' }, 401);
  }

  let body: {
    type?: string;
    days?: number;
    page?: string;
    limit?: number;
  } = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const days = Math.max(1, Math.min(90, body.days ?? 30));
  const limit = Math.max(1, Math.min(250, body.limit ?? 25));
  const endDate = isoDate(new Date());
  const startDate = isoDate(new Date(Date.now() - days * 86400_000));

  try {
    switch (body.type) {
      case 'queries': {
        const rows = await querySearchAnalytics({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: limit,
        });
        return json({
          type: 'queries',
          range: { startDate, endDate, days },
          rows,
          insights: buildQueryInsights(rows),
        });
      }

      case 'pages': {
        const rows = await querySearchAnalytics({
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: limit,
        });
        return json({
          type: 'pages',
          range: { startDate, endDate, days },
          rows,
          insights: buildPageInsights(rows),
        });
      }

      case 'page-queries': {
        if (!body.page) {
          return json({ error: 'page (URL) is required for page-queries' }, 400);
        }
        const rows = await querySearchAnalytics({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: limit,
          pageFilter: body.page,
        });
        return json({
          type: 'page-queries',
          page: body.page,
          range: { startDate, endDate, days },
          rows,
        });
      }

      case 'ga-channels': {
        const { rows } = await ga4RunReport({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'engagementRate' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit,
        });
        return json({
          type: 'ga-channels',
          range: { startDate, endDate, days },
          rows: rows.map((r) => ({
            channel: r.dimensionValues[0].value,
            sessions: Number(r.metricValues[0].value),
            users: Number(r.metricValues[1].value),
            pageviews: Number(r.metricValues[2].value),
            bounceRate: Number(r.metricValues[3].value),
            engagementRate: Number(r.metricValues[4].value),
          })),
        });
      }

      case 'ga-pages': {
        const { rows } = await ga4RunReport({
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'totalUsers' },
            { name: 'bounceRate' },
            { name: 'engagementRate' },
          ],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit,
        });
        return json({
          type: 'ga-pages',
          range: { startDate, endDate, days },
          rows: rows.map((r) => ({
            page: r.dimensionValues[0].value,
            pageviews: Number(r.metricValues[0].value),
            users: Number(r.metricValues[1].value),
            bounceRate: Number(r.metricValues[2].value),
            engagementRate: Number(r.metricValues[3].value),
          })),
        });
      }

      default:
        return json(
          { error: `Unknown type: ${body.type}` },
          400,
        );
    }
  } catch (e) {
    console.error('seo-report error:', e);
    return json(
      {
        error: e instanceof Error ? e.message : String(e),
      },
      500,
    );
  }
};

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
