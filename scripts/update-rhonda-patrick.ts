/**
 * Update Rhonda Patrick with the exact data from the template image.
 * Usage: npx tsx scripts/update-rhonda-patrick.ts
 */

import { getDb } from "../src/lib/db";

const db = getDb();

// Clear Rhonda's existing stack
db.prepare("DELETE FROM influencer_supplements WHERE influencer_id = ?").run("rhonda-patrick");

// Update her profile
db.prepare(`
  UPDATE influencers SET 
    full_name = 'Dr. Rhonda Patrick',
    channel_name = 'FoundMyFitness',
    channel_url = 'https://youtube.com/@FoundMyFitness',
    subscriber_count = '650K',
    bio = 'Biomedical scientist researching aging, nutrition, and health optimization. PhD in biomedical science.',
    category_tags = ?,
    updated_at = datetime('now')
  WHERE id = 'rhonda-patrick'
`).run(JSON.stringify(["nutrition", "longevity", "health-science"]));

// Insert supplements and links
const supplements = [
  { time_of_day: "Morning", product_name: "Creatine", brand: "Momentous", category: "Amino Acids", form: "powder", dosage: "10 g/day", frequency: "daily", comparable: "Nutricost Creapure Creatine" },
  { time_of_day: "Morning", product_name: "Collagen powder", brand: "Sparkle Wellness", category: "Protein", form: "powder", dosage: "Daily; exact dose not always listed", frequency: "daily", comparable: "Similar hydrolyzed collagen powder" },
  { time_of_day: "Morning", product_name: "L-Glutamine", brand: "Thorne", category: "Amino Acids", form: "powder", dosage: "5 g/day", frequency: "daily", comparable: "Nutricost L-Glutamine" },
  { time_of_day: "Morning", product_name: "Nicotinamide Riboside", brand: "Tru Niagen", category: "Nootropics", form: "capsule", dosage: "500–1,000 mg/day", frequency: "daily", comparable: "ProHealth NR" },
  { time_of_day: "Morning", product_name: "Urolithin A", brand: "Timeline / Mitopure", category: "Nootropics", form: "capsule", dosage: "500–1,000 mg/day", frequency: "daily", comparable: "Same product or comparable Urolithin A" },
  { time_of_day: "With Breakfast", product_name: "Fish Oil / Omega-3", brand: "Pure Encapsulations", category: "Omega-3s", form: "softgel", dosage: "2 g/day total, split into 2 × 1 g doses", frequency: "daily", comparable: "Swisse, Viva Naturals, or other IFOS-tested fish oil" },
  { time_of_day: "With Breakfast", product_name: "Alpha-Lipoic Acid", brand: "Pure Encapsulations", category: "Antioxidants", form: "capsule", dosage: "600 mg/day", frequency: "daily", comparable: "NOW Foods ALA" },
  { time_of_day: "With Breakfast", product_name: "Sulforaphane / Broccoli Sprout Supplement", brand: "Avmacol", category: "Antioxidants", form: "capsule", dosage: "2 capsules/day", frequency: "daily", comparable: "No clear budget equivalent" },
  { time_of_day: "Afternoon", product_name: "Multivitamin", brand: "Pure Encapsulations", category: "Multivitamin", form: "capsule", dosage: "1 capsule/day", frequency: "daily", comparable: "Comparable high-quality multivitamin" },
  { time_of_day: "Afternoon", product_name: "Lutein + Zeaxanthin", brand: "Pure Encapsulations", category: "Antioxidants", form: "capsule", dosage: "Included in multivitamin", frequency: "daily", comparable: "Standalone lutein + zeaxanthin supplement" },
  { time_of_day: "Afternoon", product_name: "Cocoa Extract / Flavanols", brand: "CocoaVia", category: "Antioxidants", form: "capsule", dosage: "3 capsules or 1 scoop", frequency: "daily", comparable: "Comparable cocoa flavanol product" },
  { time_of_day: "Evening", product_name: "Magnesium Glycinate", brand: "Pure Encapsulations", category: "Minerals", form: "capsule", dosage: "120 mg/day", frequency: "daily", comparable: "Nutricost Magnesium Glycinate" },
  { time_of_day: "Evening", product_name: "Vitamin D3", brand: "Pure Encapsulations", category: "Vitamins", form: "capsule", dosage: "4,000–6,000 IU/day", frequency: "daily", comparable: "Comparable D3 + K2 product" },
  { time_of_day: "Evening", product_name: "Vitamin K2 MK-7", brand: "Pure Encapsulations", category: "Vitamins", form: "capsule", dosage: "100 mcg/day", frequency: "daily", comparable: "Comparable MK-7 supplement" },
];

for (const s of supplements) {
  // Upsert supplement
  const result = db.prepare(
    `INSERT OR IGNORE INTO supplements (product_name, brand, category, form) VALUES (?, ?, ?, ?)`
  ).run(s.product_name, s.brand, s.category, s.form);

  let suppId: number;
  if (result.changes > 0) {
    suppId = result.lastInsertRowid as number;
  } else {
    const existing = db.prepare(
      "SELECT id FROM supplements WHERE product_name = ? AND brand = ?"
    ).get(s.product_name, s.brand) as { id: number };
    suppId = existing.id;
  }

  // Insert stack entry
  db.prepare(`
    INSERT INTO influencer_supplements 
    (influencer_id, supplement_id, time_of_day, dosage, frequency, comparable_alternative, 
     source_video_title, source_video_url, source_date, confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "rhonda-patrick",
    suppId,
    s.time_of_day,
    s.dosage,
    s.frequency,
    s.comparable,
    "Dr. Rhonda Patrick Supplement Routine",
    "https://youtube.com/@FoundMyFitness",
    "2026-06-20",
    "high"
  );

  console.log(`  ✓ ${s.time_of_day}: ${s.product_name} (${s.brand}) — ${s.dosage}`);
}

console.log(`\n✅ Rhonda Patrick updated: ${supplements.length} supplements with time-of-day grouping`);