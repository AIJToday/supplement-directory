/**
 * Import research JSON into local SQLite database.
 * Usage: npx tsx scripts/import-local.ts <path-to-research.json>
 */

import * as fs from "fs";
import * as path from "path";
import {
  insertInfluencer,
  insertSupplement,
  insertInfluencerSupplement,
} from "../src/lib/db";

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
  bio?: string;
  birth_year?: number;
  birth_date?: string;
  profile_image_url?: string;
  category_tags: string[];
  supplement_stack: ResearchSupplement[];
  notes?: string;
  confidence?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: npx tsx scripts/import-local.ts <path-to-research.json>");
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf-8");
const batch = JSON.parse(raw);

let influencerCount = 0;
let supplementCount = 0;
let linkCount = 0;

for (const inf of batch.influencers as ResearchInfluencer[]) {
  influencerCount++;
  const slug = inf.id || slugify(inf.full_name);

  insertInfluencer({
    id: slug,
    full_name: inf.full_name,
    channel_name: inf.channel_name,
    channel_url: inf.channel_url,
    subscriber_count: inf.subscriber_count,
    subs_checked_date: inf.subs_checked_date,
    bio: inf.bio,
    birth_year: (inf as any).birth_year,
    birth_date: (inf as any).birth_date,
    profile_image_url: inf.profile_image_url,
    category_tags: inf.category_tags,
  });

  for (const supp of inf.supplement_stack) {
    supplementCount++;
    const suppId = insertSupplement(supp);
    insertInfluencerSupplement({
      influencer_id: slug,
      supplement_id: suppId,
      dosage: supp.dosage,
      frequency: supp.frequency,
      timing: supp.timing,
      source_video_title: supp.source_video_title,
      source_video_url: supp.source_video_url,
      source_timestamp: supp.source_timestamp,
      source_date: supp.source_date,
      transcript_excerpt: supp.transcript_excerpt,
      is_sponsored: supp.is_sponsored,
      is_own_brand: supp.is_own_brand,
      has_affiliate_link: supp.has_affiliate_link,
      affiliate_details: supp.affiliate_details,
      confidence: supp.confidence,
    });
    linkCount++;
  }
}

console.log(`\n✅ Import complete:`);
console.log(`   ${influencerCount} influencers`);
console.log(`   ${supplementCount} supplement entries`);
console.log(`   ${linkCount} stack links created`);

if (batch.flagged_entries?.length) {
  console.log(`\n⚠️  ${batch.flagged_entries.length} flagged:`);
  for (const f of batch.flagged_entries) {
    console.log(`   - ${f.influencer_name}: ${f.issue}`);
  }
}