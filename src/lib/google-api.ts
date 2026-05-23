/**
 * Shared Google API helpers — Search Console + GA4 Data API.
 *
 * Used by /api/admin/seo-report (raw reports) and /api/admin/seo-expert
 * (cross-source insights). Same service account, same auth flow, same
 * site-URL resolution logic — kept here so we don't drift between the
 * two endpoints.
 */

import { GoogleAuth } from 'google-auth-library';

export const GSC_SITE_CANDIDATES = [
  'sc-domain:alexanderbergqvist.com',
  'https://alexanderbergqvist.com/',
];

let resolvedSiteUrl: string | null = null;

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

export async function getAccessToken(
  scope: string = 'https://www.googleapis.com/auth/webmasters.readonly',
): Promise<string> {
  const creds = getCreds();
  const auth = creds
    ? new GoogleAuth({ credentials: creds, scopes: [scope] })
    : new GoogleAuth({
        keyFilename: 'service-account.json',
        scopes: [scope],
      });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  if (!tokenResponse.token) throw new Error('Failed to get Google access token');
  return tokenResponse.token;
}

/**
 * Resolves which GSC property URL to use — sc-domain (Domain property)
 * vs https:// (URL prefix). Looks at what the SA actually has access
 * to and picks the matching one. Throws a clear error if the SA isn't
 * added to any matching property.
 */
export async function resolveGscSiteUrl(): Promise<string> {
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
        `Lägg till SA:n som Restricted user på alexanderbergqvist.com.`,
    );
  }
  const match = GSC_SITE_CANDIDATES.find((c) =>
    sites.some((s) => s.siteUrl === c),
  );
  if (!match) {
    throw new Error(
      `Inget matchande property för alexanderbergqvist.com. ` +
        `SA:n har bara access till: ${sites.map((s) => s.siteUrl).join(', ')}.`,
    );
  }
  resolvedSiteUrl = match;
  return resolvedSiteUrl;
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function querySearchAnalytics(opts: {
  startDate: string;
  endDate: string;
  dimensions: string[];
  rowLimit: number;
  pageFilter?: string;
}): Promise<GscRow[]> {
  const token = await getAccessToken();
  const siteUrl = await resolveGscSiteUrl();
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
  const data = (await res.json()) as { rows?: GscRow[] };
  return data.rows || [];
}

// ─── GA4 ───────────────────────────────────────────────────────────────

export interface Ga4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

export async function ga4RunReport(
  body: unknown,
): Promise<{ rows: Ga4Row[] }> {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) throw new Error('GA_PROPERTY_ID env var is not set');
  const token = await getAccessToken(
    'https://www.googleapis.com/auth/analytics.readonly',
  );
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
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

// ─── Helpers ───────────────────────────────────────────────────────────

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function dateRange(days: number): {
  startDate: string;
  endDate: string;
} {
  return {
    startDate: isoDate(new Date(Date.now() - days * 86400_000)),
    endDate: isoDate(new Date()),
  };
}

export function requireAdminAuth(request: Request): Response | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(
      JSON.stringify({ error: 'ADMIN_PASSWORD not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
  const headerPwd = request.headers.get('x-admin-password');
  if (headerPwd !== adminPassword) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return null;
}

export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
