/**
 * Data Import Pipeline
 *
 * Reads research JSON output and upserts into Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-research.ts <path-to-research.json>
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ── Types (mirrors research output) ──────────────────────────────────────────

interface ResearchSupplement {
  product_name: string;
  brand: string;
  category: string;
  dosage?: string;
  frequency?: string;
  timing?: string;
  form?: string;
  source_video_title: string;
  source_video_url: string;
  source_timestamp?: string;
  source_date?: string;
  transcript_excerpt?: string;
  is_sponsored: boolean;
  is_own_brand: boolean;
  has_affiliate_link: boolean;
  affiliate_details?: string;
  confidence: "high" | "medium" | "low";
}

interface ResearchInfluencer {
  id: string;
  full_name: string;
  channel_name: string;
  channel_url: string;
  subscriber_count?: string;
  subs_checked_date?: string;
  category_tags: string[];
  supplement_stack: ResearchSupplement[];
  notes?: string;
  confidence?: string;
}

interface ResearchBatch {
  research_batch: {
    date_generated: string;
    total_influencers: number;
    total_supplements: number;
  };
  influencers: ResearchInfluencer[];
  flagged_entries?: { influencer_name: string; issue: string; recommendation: string }[];
}

// ── Supabase Client ──────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  console.error("   Set them in .env.local before running this script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function upsertInfluencer(inf: ResearchInfluencer): Promise<string> {
  const { error } = await supabase.from("influencers").upsert(
    {
      id: inf.id || slugify(inf.full_name),
      full_name: inf.full_name,
      channel_name: inf.channel_name,
      channel_url: inf.channel_url,
      subscriber_count: inf.subscriber_count || null,
      subs_checked_date: inf.subs_checked_date || null,
      category_tags: inf.category_tags || [],
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error(`  ✗ Failed to upsert influencer ${inf.full_name}:`, error.message);
    throw error;
  }
  return inf.id || slugify(inf.full_name);
}

async function upsertSupplement(supp: ResearchSupplement): Promise<number> {
  const { data, error } = await supabase
    .from("supplements")
    .upsert(
      {
        product_name: supp.product_name,
        brand: supp.brand,
        category: supp.category,
        form: supp.form || null,
      },
      { onConflict: "product_name,brand", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) {
    console.error(`  ✗ Failed to upsert supplement ${supp.product_name}:`, error.message);
    throw error;
  }
  return data.id;
}

async function linkInfluencerSupplement(
  influencerId: string,
  supplementId: number,
  supp: ResearchSupplement
): Promise<void> {
  const { error } = await supabase.from("influencer_supplements").upsert(
    {
      influencer_id: influencerId,
      supplement_id: supplementId,
      dosage: supp.dosage || null,
      frequency: supp.frequency || null,
      timing: supp.timing || null,
      source_video_title: supp.source_video_title,
      source_video_url: supp.source_video_url,
      source_timestamp: supp.source_timestamp || null,
      source_date: supp.source_date || null,
      transcript_excerpt: supp.transcript_excerpt || null,
      is_sponsored: supp.is_sponsored,
      is_own_brand: supp.is_own_brand,
      has_affiliate_link: supp.has_affiliate_link,
      affiliate_details: supp.affiliate_details || null,
      confidence: supp.confidence || "medium",
    },
    { onConflict: "influencer_id,supplement_id" }
  );

  if (error) {
    console.error(
      `  ✗ Failed to link ${influencerId} → ${supp.product_name}:`,
      error.message
    );
  }
}

// ── Main Import ──────────────────────────────────────────────────────────────

async function importBatch(filePath: string) {
  console.log(`\n📦 Importing research data from: ${filePath}\n`);

  const raw = fs.readFileSync(filePath, "utf-8");
  const batch: ResearchBatch = JSON.parse(raw);

  let influencerCount = 0;
  let newInfluencers = 0;
  let supplementCount = 0;
  let newSupplements = 0;
  let linkCount = 0;

  for (const inf of batch.influencers) {
    influencerCount++;
    console.log(`👤 ${inf.full_name} (${inf.channel_name})`);

    try {
      await upsertInfluencer(inf);
      newInfluencers++;
    } catch {
      continue;
    }

    for (const supp of inf.supplement_stack) {
      supplementCount++;
      try {
        const suppId = await upsertSupplement(supp);
        newSupplements++;

        const influencerId = inf.id || slugify(inf.full_name);
        await linkInfluencerSupplement(influencerId, suppId, supp);
        linkCount++;
      } catch {
        continue;
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Import complete`);
  console.log(`   Influencers: ${influencerCount} processed, ${newInfluencers} upserted`);
  console.log(`   Supplements: ${supplementCount} processed, ${newSupplements} upserted`);
  console.log(`   Stack links: ${linkCount} created`);
  console.log(`   Flagged entries: ${(batch.flagged_entries || []).length}`);

  if (batch.flagged_entries && batch.flagged_entries.length > 0) {
    console.log(`\n⚠️  Flagged entries:`);
    for (const f of batch.flagged_entries) {
      console.log(`   - ${f.influencer_name}: ${f.issue}`);
    }
  }
  console.log();
}

// ── Entry Point ──────────────────────────────────────────────────────────────

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: npx tsx scripts/import-research.ts <path-to-research.json>");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

importBatch(path.resolve(filePath)).catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});