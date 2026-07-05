/**
 * Add time-of-day grouping and comparable alternatives to all influencers.
 * Usage: npx tsx scripts/add-timing-and-alternatives.ts
 */

import { getDb } from "../src/lib/db";

const db = getDb();

// ── Brand → Alternative mapping ──────────────────────────────────────────────
const ALTERNATIVES: Record<string, string> = {
  "Thorne": "NOW Foods, Life Extension, or Pure Encapsulations",
  "Pure Encapsulations": "NOW Foods, Nutricost, or Life Extension",
  "Momentous": "Nutricost, Bulk Supplements, or Thorne",
  "Nordic Naturals": "Viva Naturals, Sports Research, or Carlson Labs",
  "NOW Foods": "Bulk Supplements or Nutricost",
  "Life Extension": "NOW Foods or Nutricost",
  "Jarrow Formulas": "NOW Foods or Doctor's Best",
  "Doctor's Best": "NOW Foods or Jarrow Formulas",
  "Sports Research": "Viva Naturals or Nutricost",
  "Garden of Life": "NOW Foods or MegaFood",
  "Nature Made": "Kirkland Signature or store brand",
  "Blueprint": "No direct alternative (proprietary formulation)",
  "Kion": "NOW Foods, Life Extension, or Bulk Supplements",
  "Gorilla Mind": "Nutricost, Bulk Supplements, or NOW Foods",
  "Athletic Greens": "Amazing Grass, Bloom, or Organifi",
  "Bulletproof": "NOW Foods or Nutricost",
  "Onnit": "NOW Foods or Jarrow Formulas",
  "Mind Lab Pro": "Qualia Mind or Genius Consciousness",
  "Organifi": "Amazing Grass or Bloom",
};

function getAlternative(brand: string, productName: string): string {
  // Check brand-level mapping
  for (const [key, val] of Object.entries(ALTERNATIVES)) {
    if (brand.includes(key)) return val;
  }
  // Category-based fallbacks
  if (productName.match(/magnesium/i)) return "Nutricost Magnesium Glycinate";
  if (productName.match(/vitamin\s*d/i)) return "NOW Foods or Sports Research D3";
  if (productName.match(/omega|fish\s*oil/i)) return "Viva Naturals or Sports Research Omega-3";
  if (productName.match(/creatine/i)) return "Nutricost Creapure Creatine";
  if (productName.match(/protein|whey/i)) return "Optimum Nutrition or Dymatize";
  if (productName.match(/collagen/i)) return "Vital Proteins or Sports Research Collagen";
  if (productName.match(/multivitamin/i)) return "Life Extension or Thorne Multivitamin";
  if (productName.match(/nootropic|alpha\s*brain/i)) return "NOW Foods or Life Extension";
  return "Comparable product from NOW Foods, Nutricost, or Life Extension";
}

// ── Timing patterns by influencer ────────────────────────────────────────────
// Format: [time_of_day, dosage_suffix]
const TIMING: Record<string, string> = {
  // Supplements typically taken in the morning
  "Vitamin D": "Morning",
  "Vitamin D3": "Morning",
  "Multivitamin": "Morning",
  "AG1": "Morning",
  "Athletic Greens": "Morning",
  "Greens Powder": "Morning",
  "Creatine": "Morning",
  "NMN": "Morning",
  "Nicotinamide Riboside": "Morning",
  "Resveratrol": "Morning",
  "Collagen": "Morning",
  "L-Theanine": "Morning",
  "L-Tyrosine": "Morning",
  "Alpha-GPC": "Morning",
  "Caffeine": "Morning",
  "Coffee": "Morning",
  "MCT Oil": "Morning",
  "Probiotic": "Morning",
  "Electrolytes": "Morning",

  // With meals / throughout day
  "Fish Oil": "With Breakfast",
  "Omega-3": "With Breakfast",
  "Krill Oil": "With Breakfast",
  "CoQ10": "With Breakfast",
  "Ubiquinol": "With Breakfast",
  "Vitamin K2": "With Breakfast",
  "ALA": "With Breakfast",
  "Alpha-Lipoic Acid": "With Breakfast",
  "Curcumin": "With Breakfast",
  "Turmeric": "With Breakfast",

  // Afternoon / pre-workout
  "Citrulline": "Afternoon",
  "Beta-Alanine": "Afternoon",
  "BCAA": "Afternoon",
  "Pre-Workout": "Afternoon",

  // Evening
  "Magnesium": "Evening",
  "Magnesium Glycinate": "Evening",
  "Magnesium Threonate": "Evening",
  "ZMA": "Evening",
  "Zinc": "Evening",
  "Melatonin": "Evening",
  "Apigenin": "Evening",
  "GABA": "Evening",
  "Glycine": "Evening",
};

function guessTimeOfDay(productName: string, category: string): string {
  const name = productName.toLowerCase();

  // Direct matches
  for (const [key, tod] of Object.entries(TIMING)) {
    if (name.includes(key.toLowerCase()) || category.toLowerCase().includes(key.toLowerCase())) {
      return tod;
    }
  }

  // Category-based heuristics
  if (name.match(/sleep|melatonin|magnesium|zinc|gaba|glycine|theanine|apigenin/)) return "Evening";
  if (name.match(/caffeine|pre.workout|energy|stim|nootropic|alpha.brain|tyrosine/)) return "Morning";
  if (name.match(/omega|fish.oil|krill|coq10|ubiquinol|curcumin|turmeric|ala|lipoic/)) return "With Breakfast";
  if (name.match(/protein|whey|collagen|creatine|bcaa|amino/)) return "Morning";
  if (name.match(/vitamin\s*d|greens|multi|probiotic|nmn|resveratrol/)) return "Morning";

  return "Morning"; // default
}

// ── Update ALL influencers ────────────────────────────────────────────────────

const influencers = db.prepare("SELECT id, full_name FROM influencers ORDER BY full_name").all() as any[];

for (const inf of influencers) {
  // Get current stack
  const stack = db.prepare(`
    SELECT s.id as entry_id, s.supplement_id, sup.product_name, sup.brand, sup.category, s.dosage, s.frequency, s.timing
    FROM influencer_supplements s
    JOIN supplements sup ON s.supplement_id = sup.id
    WHERE s.influencer_id = ?
  `).all(inf.id) as any[];

  if (stack.length === 0) {
    console.log(`  ${inf.full_name}: no supplements, skipping`);
    continue;
  }

  // Skip Rhonda — already done
  if (inf.id === "rhonda-patrick") {
    console.log(`  ${inf.full_name}: already updated ✓`);
    continue;
  }

  let updated = 0;
  for (const entry of stack) {
    const timeOfDay = guessTimeOfDay(entry.product_name, entry.category);
    const alternative = getAlternative(entry.brand, entry.product_name);

    db.prepare(`
      UPDATE influencer_supplements
      SET time_of_day = ?, comparable_alternative = ?
      WHERE id = ?
    `).run(timeOfDay, alternative, entry.entry_id);
    updated++;
  }

  console.log(`  ✓ ${inf.full_name}: ${updated} entries updated`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
const summary = db.prepare(`
  SELECT time_of_day, COUNT(*) as cnt FROM influencer_supplements GROUP BY time_of_day ORDER BY cnt DESC
`).all() as any[];

console.log(`\n📊 Time-of-day distribution across all influencers:`);
for (const row of summary) {
  console.log(`  ${row.time_of_day || 'Unspecified'}: ${row.cnt}`);
}

console.log(`\n✅ All done! Restart the dev server to see changes.`);