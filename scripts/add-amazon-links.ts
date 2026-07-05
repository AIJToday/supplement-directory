/**
 * Add Amazon affiliate links to all supplements.
 * Uses amazon.com search links that resolve to the actual product.
 * Replace "YOURTAG" with your actual Amazon Associates tag later.
 */
import { getDb } from "../src/lib/db";

const db = getDb();

// ── Brand → Amazon store/search mapping ────────────────────────────────────
const BRAND_LINKS: Record<string, string> = {
  "Thorne": "https://www.amazon.com/s?k=Thorne+{product}&tag=YOURTAG",
  "Pure Encapsulations": "https://www.amazon.com/s?k=Pure+Encapsulations+{product}&tag=YOURTAG",
  "NOW Foods": "https://www.amazon.com/s?k=NOW+Foods+{product}&tag=YOURTAG",
  "Momentous": "https://www.amazon.com/s?k=Momentous+{product}&tag=YOURTAG",
  "Nordic Naturals": "https://www.amazon.com/s?k=Nordic+Naturals+{product}&tag=YOURTAG",
  "Jarrow Formulas": "https://www.amazon.com/s?k=Jarrow+Formulas+{product}&tag=YOURTAG",
  "Doctor's Best": "https://www.amazon.com/s?k=Doctors+Best+{product}&tag=YOURTAG",
  "Sports Research": "https://www.amazon.com/s?k=Sports+Research+{product}&tag=YOURTAG",
  "Life Extension": "https://www.amazon.com/s?k=Life+Extension+{product}&tag=YOURTAG",
  "Vital Proteins": "https://www.amazon.com/s?k=Vital+Proteins+{product}&tag=YOURTAG",
  "Garden of Life": "https://www.amazon.com/s?k=Garden+of+Life+{product}&tag=YOURTAG",
  "Nature Made": "https://www.amazon.com/s?k=Nature+Made+{product}&tag=YOURTAG",
  "Carlson Labs": "https://www.amazon.com/s?k=Carlson+Labs+{product}&tag=YOURTAG",
  "Nutricost": "https://www.amazon.com/s?k=Nutricost+{product}&tag=YOURTAG",
  "BulkSupplements": "https://www.amazon.com/s?k=BulkSupplements+{product}&tag=YOURTAG",
  "Transparent Labs": "https://www.amazon.com/s?k=Transparent+Labs+{product}&tag=YOURTAG",
  "Optimum Nutrition": "https://www.amazon.com/s?k=Optimum+Nutrition+{product}&tag=YOURTAG",
  "Kion": "https://www.amazon.com/s?k=Kion+{product}&tag=YOURTAG",
  "Gorilla Mind": "https://www.amazon.com/s?k=Gorilla+Mind+{product}&tag=YOURTAG",
  "Bulletproof": "https://www.amazon.com/s?k=Bulletproof+{product}&tag=YOURTAG",
  "Blueprint": "https://www.amazon.com/s?k=Blueprint+{product}&tag=YOURTAG",
  "Onnit": "https://www.amazon.com/s?k=Onnit+{product}&tag=YOURTAG",
  "Seed": "https://www.amazon.com/s?k=Seed+{product}&tag=YOURTAG",
  "LMNT": "https://www.amazon.com/s?k=LMNT+{product}&tag=YOURTAG",
  "Tru Niagen": "https://www.amazon.com/s?k=Tru+Niagen+{product}&tag=YOURTAG",
  "Timeline / Mitopure": "https://www.amazon.com/s?k=Mitopure+Urolithin+A&tag=YOURTAG",
  "Athletic Greens": "https://www.amazon.com/s?k=Athletic+Greens+AG1&tag=YOURTAG",
  "CocoaVia": "https://www.amazon.com/s?k=CocoaVia+{product}&tag=YOURTAG",
  "Avmacol": "https://www.amazon.com/s?k=Avmacol+{product}&tag=YOURTAG",
  "Sparkle Wellness": "https://www.amazon.com/s?k=Sparkle+Wellness+Collagen&tag=YOURTAG",
  "DoNotAge": "https://www.amazon.com/s?k=DoNotAge+{product}&tag=YOURTAG",
};

// ── Direct product links for well-known supplements ─────────────────────────
const DIRECT_LINKS: Record<string, string> = {
  // Thorne
  "Vitamin D-5000": "https://www.amazon.com/s?k=Thorne+Vitamin+D+5000&tag=YOURTAG",
  "L-Theanine": "https://www.amazon.com/s?k=Thorne+L-Theanine+200mg&tag=YOURTAG",
  "L-Glutamine": "https://www.amazon.com/s?k=Thorne+L-Glutamine&tag=YOURTAG",
  // Momentous
  "Creatine Monohydrate": "https://www.amazon.com/s?k=Momentous+Creatine&tag=YOURTAG",
  // Nordic Naturals
  "Omega-3": "https://www.amazon.com/s?k=Nordic+Naturals+Omega+3&tag=YOURTAG",
  // Pure Encapsulations
  "Magnesium Glycinate": "https://www.amazon.com/s?k=Pure+Encapsulations+Magnesium+Glycinate&tag=YOURTAG",
  "Alpha-Lipoic Acid": "https://www.amazon.com/s?k=Pure+Encapsulations+Alpha+Lipoic+Acid&tag=YOURTAG",
  "Multivitamin": "https://www.amazon.com/s?k=Pure+Encapsulations+ONE+Multivitamin&tag=YOURTAG",
  "Vitamin D3": "https://www.amazon.com/s?k=Pure+Encapsulations+Vitamin+D3&tag=YOURTAG",
  // Vital Proteins
  "Collagen Peptides": "https://www.amazon.com/s?k=Vital+Proteins+Collagen+Peptides&tag=YOURTAG",
};

const supplements = db.prepare("SELECT id, product_name, brand FROM supplements").all() as any[];

let updated = 0;

for (const s of supplements) {
  // Try direct link first
  let url = DIRECT_LINKS[s.product_name];

  // Then try brand mapping
  if (!url) {
    const template = BRAND_LINKS[s.brand];
    if (template) {
      const searchTerm = s.product_name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "+");
      url = template.replace("{product}", searchTerm);
    }
  }

  // Fallback: generic Amazon search
  if (!url) {
    const query = encodeURIComponent(`${s.brand} ${s.product_name}`);
    url = `https://www.amazon.com/s?k=${query}&tag=YOURTAG`;
  }

  db.prepare("UPDATE supplements SET amazon_url = ? WHERE id = ?").run(url, s.id);
  updated++;
  console.log(`  ✓ ${s.product_name} (${s.brand})`);
}

console.log(`\n✅ Updated ${updated} supplements with Amazon links`);
console.log(`\n🔑 Replace 'YOURTAG' with your Amazon Associates tag later:`);
console.log(`   sed -i '' 's/tag=YOURTAG/tag=YOUR-ACTUAL-TAG-20/g' data/directory.db`);