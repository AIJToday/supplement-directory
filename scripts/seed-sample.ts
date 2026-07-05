/**
 * Quick seed — adds one sample influencer so the site isn't empty.
 * Usage: npx tsx scripts/seed-sample.ts
 */

import { insertInfluencer, insertSupplement, insertInfluencerSupplement } from "../src/lib/db";

console.log("🌱 Seeding sample data...\n");

// ── Andrew Huberman ─────────────────────────────────────────────────────────
insertInfluencer({
  id: "andrew-huberman",
  full_name: "Andrew Huberman",
  channel_name: "Huberman Lab",
  channel_url: "https://youtube.com/@hubermanlab",
  subscriber_count: "6.5M",
  subs_checked_date: "2026-06-20",
  bio: "Neuroscientist and professor at Stanford. Host of the Huberman Lab podcast.",
  category_tags: ["neuroscience", "longevity", "fitness"],
});

const hubermanSupps = [
  { product_name: "Vitamin D-5000", brand: "Thorne", category: "Vitamin D", form: "capsule", dosage: "5000 IU", frequency: "daily", timing: "Morning, with food" },
  { product_name: "Omega-3", brand: "Nordic Naturals", category: "Omega-3s", form: "softgel", dosage: "2g EPA/DHA", frequency: "daily", timing: "With meals" },
  { product_name: "Magnesium Threonate", brand: "Momentous", category: "Minerals", form: "capsule", dosage: "145mg", frequency: "daily", timing: "Evening, before bed" },
  { product_name: "L-Theanine", brand: "Thorne", category: "Amino Acids", form: "capsule", dosage: "200mg", frequency: "as needed", timing: "With caffeine" },
  { product_name: "Creatine Monohydrate", brand: "Momentous", category: "Amino Acids", form: "powder", dosage: "5g", frequency: "daily", timing: "Morning" },
];

for (const s of hubermanSupps) {
  const id = insertSupplement(s);
  insertInfluencerSupplement({
    influencer_id: "andrew-huberman",
    supplement_id: id,
    dosage: (s as any).dosage,
    frequency: (s as any).frequency,
    timing: (s as any).timing,
    source_video_title: "My Supplement Routine",
    source_video_url: "https://youtube.com/watch?v=example1",
    source_timestamp: "12:34",
    source_date: "2026-05-15",
    transcript_excerpt: `I take ${s.dosage} of ${s.product_name} ${s.frequency}...`,
    is_sponsored: s.brand === "Momentous",
    has_affiliate_link: true,
    confidence: "high",
  });
  console.log(`  ✓ ${s.product_name} (${s.brand}) — ${s.dosage}`);
}

// ── Bryan Johnson ───────────────────────────────────────────────────────────
insertInfluencer({
  id: "bryan-johnson",
  full_name: "Bryan Johnson",
  channel_name: "Bryan Johnson",
  channel_url: "https://youtube.com/@bryanjohnson",
  subscriber_count: "1.2M",
  subs_checked_date: "2026-06-20",
  bio: "Founder of Blueprint — an algorithmic approach to health and longevity.",
  category_tags: ["longevity", "biohacking"],
});

const johnsonSupps = [
  { product_name: "Essential Capsules", brand: "Blueprint", category: "Multivitamin", form: "capsule", dosage: "3 capsules", frequency: "daily", timing: "Morning" },
  { product_name: "NAC + Ginger + Curcumin", brand: "Blueprint", category: "Antioxidants", form: "capsule", dosage: "2 capsules", frequency: "daily", timing: "Morning" },
  { product_name: "Cocoa Flavanols", brand: "Blueprint", category: "Antioxidants", form: "powder", dosage: "500mg", frequency: "daily", timing: "Morning" },
];

for (const s of johnsonSupps) {
  const id = insertSupplement(s);
  insertInfluencerSupplement({
    influencer_id: "bryan-johnson",
    supplement_id: id,
    dosage: (s as any).dosage,
    frequency: (s as any).frequency,
    timing: (s as any).timing,
    source_video_title: "Blueprint Stack Explained",
    source_video_url: "https://youtube.com/watch?v=example2",
    source_timestamp: "5:20",
    source_date: "2026-06-01",
    transcript_excerpt: `My daily stack includes ${s.product_name}...`,
    is_own_brand: s.brand === "Blueprint",
    confidence: "high",
  });
  console.log(`  ✓ ${s.product_name} (${s.brand}) — ${s.dosage}`);
}

console.log(`\n✅ Seed complete: 2 influencers, ${hubermanSupps.length + johnsonSupps.length} supplements`);
console.log("   Restart the dev server to see the data.");