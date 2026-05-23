/**
 * App Store Connect API client.
 *
 * Auth via JWT signed with ES256 + ASC API key (.p8 file content).
 * Mirrors the Python `AscClient` in ~/Downloads/asc-launcher/asc_client.py
 * so the same key works in both.
 *
 * Env vars (set in Vercel):
 *   ASC_KEY_ID — 10-char ASC API key id
 *   ASC_ISSUER_ID — issuer UUID
 *   ASC_PRIVATE_KEY — contents of the .p8 file (multi-line). Either
 *     paste the file contents verbatim (with \n line breaks) or
 *     base64-encode the whole file and set ASC_PRIVATE_KEY_B64 instead.
 *   ASC_VENDOR_NUMBER — your Apple vendor id (~10 digits, find via
 *     ASC → Sales and Trends → top of the page)
 *
 * Sales Reports specifically need the vendor number — they're keyed by
 * developer account, not by individual app.
 */

import jwt from 'jsonwebtoken';
import { gunzipSync } from 'node:zlib';

let cachedToken: { token: string; exp: number } | null = null;

function getPrivateKey(): string {
  const b64 = process.env.ASC_PRIVATE_KEY_B64;
  if (b64) return Buffer.from(b64, 'base64').toString('utf8');
  const raw = process.env.ASC_PRIVATE_KEY;
  if (raw) {
    // Vercel env var input strips real newlines — accept "\n" as
    // escape sequence the way Stripe/Firebase docs all do it.
    return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw;
  }
  throw new Error(
    'ASC_PRIVATE_KEY or ASC_PRIVATE_KEY_B64 not set in environment',
  );
}

function getJwt(): string {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedToken.exp - 60) return cachedToken.token;

  const keyId = process.env.ASC_KEY_ID;
  const issuerId = process.env.ASC_ISSUER_ID;
  if (!keyId || !issuerId) {
    throw new Error('ASC_KEY_ID or ASC_ISSUER_ID not set');
  }
  const privateKey = getPrivateKey();

  const exp = now + 19 * 60; // Apple max is 20 min — refresh at 19
  const token = jwt.sign(
    {
      iss: issuerId,
      iat: now,
      exp,
      aud: 'appstoreconnect-v1',
    },
    privateKey,
    { algorithm: 'ES256', header: { alg: 'ES256', kid: keyId, typ: 'JWT' } },
  );
  cachedToken = { token, exp };
  return token;
}

// ─── Apps ──────────────────────────────────────────────────────────────

interface AscApp {
  id: string;
  bundleId: string;
  name: string;
  sku: string;
}

/**
 * List all apps under the developer account. Used to map bundleId →
 * ASC app id and for cross-referencing sales reports.
 */
export async function listApps(): Promise<AscApp[]> {
  const token = getJwt();
  const apps: AscApp[] = [];
  let url: string | null =
    'https://api.appstoreconnect.apple.com/v1/apps?limit=200';
  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ASC /v1/apps ${res.status}: ${text}`);
    }
    const data: any = await res.json();
    for (const item of data.data || []) {
      apps.push({
        id: item.id,
        bundleId: item.attributes?.bundleId ?? '',
        name: item.attributes?.name ?? '',
        sku: item.attributes?.sku ?? '',
      });
    }
    url = data.links?.next ?? null;
  }
  return apps;
}

// ─── Sales Reports ─────────────────────────────────────────────────────
//
// Sales reports come back as gzipped TSV. They're keyed by vendor number
// and contain rows per app per country per day. The "Provider" column =
// SKU which we use to map back to a bundle id (via listApps above).

export interface SalesRow {
  date: string; // YYYY-MM-DD
  sku: string;
  appName: string;
  countryCode: string; // ISO-2
  units: number; // Downloads/installs for that row
  proceeds: number; // Developer share in `currency` (after Apple's cut)
  currency: string; // 3-letter, e.g. USD
}

/**
 * Fetch daily sales report for a given UTC date. Apple has a ~2 day
 * delay on availability — yesterday usually works, today usually does
 * not. Returns [] if Apple has no data for that date.
 */
export async function fetchDailySales(dateYyyyMmDd: string): Promise<SalesRow[]> {
  const vendorNumber = process.env.ASC_VENDOR_NUMBER;
  if (!vendorNumber) throw new Error('ASC_VENDOR_NUMBER not set');
  const token = getJwt();

  // No filter[version] — that's for SUBSCRIPTION reports only. For
  // plain SALES.SUMMARY.DAILY Apple defaults to the latest version,
  // which works for our use (units + developer proceeds per country).
  const params = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[vendorNumber]': vendorNumber,
    'filter[reportDate]': dateYyyyMmDd,
  });
  const url = `https://api.appstoreconnect.apple.com/v1/salesReports?${params}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/a-gzip, application/json',
    },
  });
  if (res.status === 404) return []; // No data for that date yet
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ASC salesReports ${res.status}: ${text}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const tsv = gunzipSync(buf).toString('utf8');
  return parseSalesTsv(tsv, dateYyyyMmDd);
}

function parseSalesTsv(tsv: string, fallbackDate: string): SalesRow[] {
  const lines = tsv.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split('\t').map((h) => h.trim());
  // Column indices — Apple's column order is stable for v1_3.
  const idx = (name: string) => headers.indexOf(name);
  const skuIdx = idx('SKU');
  const titleIdx = idx('Title');
  const unitsIdx = idx('Units');
  const proceedsIdx = idx('Developer Proceeds');
  const countryIdx = idx('Country Code');
  const currencyIdx = idx('Currency of Proceeds');
  const beginIdx = idx('Begin Date');

  const out: SalesRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('\t');
    if (cells.length < headers.length) continue;
    const beginRaw = beginIdx >= 0 ? cells[beginIdx]?.trim() : '';
    const date = beginRaw
      ? // Apple format: "MM/DD/YYYY" → "YYYY-MM-DD"
        beginRaw.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$1-$2')
      : fallbackDate;
    out.push({
      date,
      sku: cells[skuIdx]?.trim() ?? '',
      appName: cells[titleIdx]?.trim() ?? '',
      countryCode: cells[countryIdx]?.trim() ?? '',
      units: Number(cells[unitsIdx] ?? 0) || 0,
      proceeds: Number(cells[proceedsIdx] ?? 0) || 0,
      currency: cells[currencyIdx]?.trim() ?? 'USD',
    });
  }
  return out;
}

/**
 * Fetches sales for a date range (inclusive on both ends). Apple has
 * per-day reports only — we loop. Returns flat rows + any errors hit
 * so callers can decide if 0 rows means "no sales" or "API problem".
 */
export async function fetchSalesRange(
  startDate: Date,
  endDate: Date,
): Promise<{ rows: SalesRow[]; daysFetched: number; daysSkipped: number; firstError: string | null }> {
  const rows: SalesRow[] = [];
  const day = 24 * 60 * 60 * 1000;
  let daysFetched = 0;
  let daysSkipped = 0;
  let firstError: string | null = null;
  for (let t = startDate.getTime(); t <= endDate.getTime(); t += day) {
    const d = new Date(t);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    try {
      const dayRows = await fetchDailySales(`${yyyy}-${mm}-${dd}`);
      rows.push(...dayRows);
      daysFetched += 1;
    } catch (e) {
      // Skip 404 silently — common for last 2-3 days Apple hasn't published.
      // Surface other errors so we can debug auth / param issues.
      const msg = e instanceof Error ? e.message : String(e);
      daysSkipped += 1;
      if (!msg.includes('404') && firstError === null) {
        firstError = `${yyyy}-${mm}-${dd}: ${msg}`;
      }
    }
  }
  return { rows, daysFetched, daysSkipped, firstError };
}

// ─── Aggregations ──────────────────────────────────────────────────────

export interface AppSalesSummary {
  sku: string;
  appName: string;
  units: number;
  proceeds: number;
  currency: string;
  byCountry: Record<string, number>; // country → units
}

/** Roll up flat rows into per-app totals + country breakdown. */
export function summarizeByApp(rows: SalesRow[]): AppSalesSummary[] {
  const map = new Map<string, AppSalesSummary>();
  for (const r of rows) {
    let s = map.get(r.sku);
    if (!s) {
      s = {
        sku: r.sku,
        appName: r.appName,
        units: 0,
        proceeds: 0,
        currency: r.currency,
        byCountry: {},
      };
      map.set(r.sku, s);
    }
    s.units += r.units;
    s.proceeds += r.proceeds;
    s.byCountry[r.countryCode] = (s.byCountry[r.countryCode] ?? 0) + r.units;
  }
  return Array.from(map.values()).sort((a, b) => b.units - a.units);
}
