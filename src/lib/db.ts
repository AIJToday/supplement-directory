// @ts-ignore — better-sqlite3 uses CJS
import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "directory.db");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(): any {
  if (db) return db;

  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS influencers (
      id              TEXT PRIMARY KEY,
      full_name       TEXT NOT NULL,
      channel_name    TEXT NOT NULL,
      channel_url     TEXT NOT NULL,
      subscriber_count TEXT,
      subs_checked_date TEXT,
      bio             TEXT,
      profile_image_url TEXT,
      category_tags   TEXT DEFAULT '[]',
      created_at      TEXT DEFAULT (datetime('now')),
      updated_at      TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS supplements (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name    TEXT NOT NULL,
      brand           TEXT NOT NULL,
      category        TEXT NOT NULL,
      form            TEXT,
      description     TEXT,
      amazon_url      TEXT,
      created_at      TEXT DEFAULT (datetime('now')),
      UNIQUE(product_name, brand)
    );

    CREATE TABLE IF NOT EXISTS influencer_supplements (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      influencer_id       TEXT REFERENCES influencers(id) ON DELETE CASCADE,
      supplement_id       INTEGER REFERENCES supplements(id) ON DELETE CASCADE,
      time_of_day         TEXT,
      dosage              TEXT,
      frequency           TEXT,
      timing              TEXT,
      comparable_alternative TEXT,
      source_video_title  TEXT,
      source_video_url    TEXT NOT NULL,
      source_timestamp    TEXT,
      source_date         TEXT,
      transcript_excerpt  TEXT,
      is_sponsored        INTEGER DEFAULT 0,
      is_own_brand        INTEGER DEFAULT 0,
      has_affiliate_link  INTEGER DEFAULT 0,
      affiliate_details   TEXT,
      confidence          TEXT DEFAULT 'medium',
      notes               TEXT,
      created_at          TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_is_influencer ON influencer_supplements(influencer_id);
    CREATE INDEX IF NOT EXISTS idx_is_supplement ON influencer_supplements(supplement_id);
    CREATE INDEX IF NOT EXISTS idx_supp_brand ON supplements(brand);
    CREATE INDEX IF NOT EXISTS idx_supp_category ON supplements(category);
  `);

  return db;
}

// ── Query helpers (mimics Supabase-style API) ────────────────────────────────

interface QueryOptions {
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
  limit?: number;
  offset?: number;
}

function parseJsonArray(val: string | null): string[] {
  if (!val || val === "[]") return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

/** Parse subscriber count string like "6.5M", "650K", "1.2M", "6.5M+" into a numeric value */
function parseSubCount(subCount: string | null): number {
  if (!subCount) return 0;
  const s = subCount.trim().toUpperCase().replace("+", "");
  const num = parseFloat(s.replace(/[^0-9.]/g, ""));
  if (s.includes("M")) return num * 1_000_000;
  if (s.includes("K")) return num * 1_000;
  return num;
}

export function getAllInfluencers(opts: QueryOptions = {}) {
  const d = getDb();
  return d
    .prepare(
      `SELECT i.*, 
        (SELECT COUNT(*) FROM influencer_supplements WHERE influencer_id = i.id) as stack_count,
        (SELECT confidence FROM influencer_supplements WHERE influencer_id = i.id ORDER BY 
          CASE confidence WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END LIMIT 1
        ) as avg_confidence
      FROM influencers i ORDER BY i.full_name`
    )
    .all()
    .map((row: any) => ({
      ...row,
      category_tags: parseJsonArray(row.category_tags),
    }))
    .sort((a: any, b: any) => parseSubCount(b.subscriber_count) - parseSubCount(a.subscriber_count));
}

export function getInfluencersByCategory(category: string) {
  const d = getDb();
  return d
    .prepare(
      `SELECT i.*,
        (SELECT COUNT(*) FROM influencer_supplements WHERE influencer_id = i.id) as stack_count
      FROM influencers i
      WHERE i.category_tags LIKE ?
      ORDER BY i.full_name`
    )
    .all(`%${category}%`)
    .map((row: any) => ({
      ...row,
      category_tags: parseJsonArray(row.category_tags),
    }))
    .sort((a: any, b: any) => parseSubCount(b.subscriber_count) - parseSubCount(a.subscriber_count));
}

export function getInfluencerBySlug(slug: string) {
  const d = getDb();
  const inf = d.prepare("SELECT * FROM influencers WHERE id = ?").get(slug) as any;
  if (!inf) return null;
  return { ...inf, category_tags: parseJsonArray(inf.category_tags) };
}

export function getInfluencerStack(influencerId: string) {
  const d = getDb();
  return d
    .prepare(
      `SELECT s.*, sup.product_name, sup.brand, sup.category as supp_category, sup.form, sup.amazon_url, sup.description
      FROM influencer_supplements s
      JOIN supplements sup ON s.supplement_id = sup.id
      WHERE s.influencer_id = ?
      ORDER BY 
        CASE s.time_of_day 
          WHEN 'Morning' THEN 1 
          WHEN 'With Breakfast' THEN 2 
          WHEN 'Afternoon' THEN 3 
          WHEN 'Evening' THEN 4 
          ELSE 5 
        END,
        sup.product_name`
    )
    .all(influencerId)
    .map((row: any) => ({
      ...row,
      is_sponsored: !!row.is_sponsored,
      is_own_brand: !!row.is_own_brand,
      has_affiliate_link: !!row.has_affiliate_link,
      supplement: {
        product_name: row.product_name,
        brand: row.brand,
        category: row.supp_category,
        form: row.form,
        amazon_url: row.amazon_url,
        description: row.description,
      },
    }));
}

export function getAllSupplements() {
  const d = getDb();
  return d.prepare("SELECT * FROM supplements ORDER BY product_name").all();
}

export function getSupplementById(id: number) {
  const d = getDb();
  return d.prepare("SELECT * FROM supplements WHERE id = ?").get(id);
}

export function getSupplementUsers(supplementId: number) {
  const d = getDb();
  return d
    .prepare(
      `SELECT s.*, i.full_name, i.channel_name, i.profile_image_url, i.id as influencer_id
      FROM influencer_supplements s
      JOIN influencers i ON s.influencer_id = i.id
      WHERE s.supplement_id = ?`
    )
    .all(supplementId)
    .map((row: any) => ({
      ...row,
      is_sponsored: !!row.is_sponsored,
      is_own_brand: !!row.is_own_brand,
      has_affiliate_link: !!row.has_affiliate_link,
      influencer: {
        id: row.influencer_id,
        full_name: row.full_name,
        channel_name: row.channel_name,
        profile_image_url: row.profile_image_url,
      },
    }));
}

export function getAllBrands(): { brand: string; count: number }[] {
  const d = getDb();
  return d
    .prepare(
      "SELECT brand, COUNT(*) as count FROM supplements GROUP BY brand ORDER BY brand"
    )
    .all() as { brand: string; count: number }[];
}

export function getSupplementsByBrand(brand: string) {
  const d = getDb();
  return d
    .prepare("SELECT * FROM supplements WHERE brand = ? ORDER BY product_name")
    .all(brand);
}

export function searchAll(query: string) {
  const d = getDb();
  const q = `%${query}%`;
  const influencers = d
    .prepare(
      `SELECT id, full_name, channel_name, profile_image_url, 'influencer' as type
      FROM influencers WHERE full_name LIKE ? OR channel_name LIKE ? LIMIT 10`
    )
    .all(q, q);
  const supplements = d
    .prepare(
      `SELECT id, product_name, brand, 'supplement' as type
      FROM supplements WHERE product_name LIKE ? OR brand LIKE ? LIMIT 10`
    )
    .all(q, q);
  return { influencers, supplements };
}

// ── Write helpers (for seed/import scripts) ──────────────────────────────────

export function insertInfluencer(inf: {
  id: string;
  full_name: string;
  channel_name: string;
  channel_url: string;
  subscriber_count?: string;
  subs_checked_date?: string;
  bio?: string;
  profile_image_url?: string;
  category_tags?: string[];
}) {
  const d = getDb();
  d.prepare(
    `INSERT OR REPLACE INTO influencers (id, full_name, channel_name, channel_url, subscriber_count, subs_checked_date, bio, profile_image_url, category_tags, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  ).run(
    inf.id,
    inf.full_name,
    inf.channel_name,
    inf.channel_url,
    inf.subscriber_count || null,
    inf.subs_checked_date || null,
    inf.bio || null,
    inf.profile_image_url || null,
    JSON.stringify(inf.category_tags || []),
  );
}

export function insertSupplement(supp: {
  product_name: string;
  brand: string;
  category: string;
  form?: string;
  description?: string;
}): number {
  const d = getDb();
  const result = d
    .prepare(
      `INSERT OR IGNORE INTO supplements (product_name, brand, category, form, description)
      VALUES (?, ?, ?, ?, ?)`
    )
    .run(supp.product_name, supp.brand, supp.category, supp.form || null, supp.description || null);

  if (result.changes > 0) return result.lastInsertRowid as number;

  // Already exists — get its ID
  const existing = d
    .prepare("SELECT id FROM supplements WHERE product_name = ? AND brand = ?")
    .get(supp.product_name, supp.brand) as { id: number };
  return existing.id;
}

export function insertInfluencerSupplement(entry: {
  influencer_id: string;
  supplement_id: number;
  time_of_day?: string;
  dosage?: string;
  frequency?: string;
  timing?: string;
  comparable_alternative?: string;
  source_video_title?: string;
  source_video_url: string;
  source_timestamp?: string;
  source_date?: string;
  transcript_excerpt?: string;
  is_sponsored?: boolean;
  is_own_brand?: boolean;
  has_affiliate_link?: boolean;
  affiliate_details?: string;
  confidence?: string;
}) {
  const d = getDb();
  d.prepare(
    `INSERT OR REPLACE INTO influencer_supplements
    (influencer_id, supplement_id, time_of_day, dosage, frequency, timing, comparable_alternative, source_video_title, source_video_url, source_timestamp, source_date, transcript_excerpt, is_sponsored, is_own_brand, has_affiliate_link, affiliate_details, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    entry.influencer_id,
    entry.supplement_id,
    entry.time_of_day || null,
    entry.dosage || null,
    entry.frequency || null,
    entry.timing || null,
    entry.comparable_alternative || null,
    entry.source_video_title || null,
    entry.source_video_url,
    entry.source_timestamp || null,
    entry.source_date || null,
    entry.transcript_excerpt || null,
    entry.is_sponsored ? 1 : 0,
    entry.is_own_brand ? 1 : 0,
    entry.has_affiliate_link ? 1 : 0,
    entry.affiliate_details || null,
    entry.confidence || "medium",
  );
}