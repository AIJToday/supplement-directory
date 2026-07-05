/**
 * Add descriptions to all supplements.
 */
import { getDb } from "../src/lib/db";

const db = getDb();

const descriptions: Record<string, string> = {
  // Vitamins
  "Vitamin D": "Vitamin D is essential for calcium absorption, bone health, and immune function. Most people are deficient, especially those with limited sun exposure. Supplementation supports mood, hormone health, and reduces inflammation.",
  "Vitamin D3": "The most bioavailable form of vitamin D. Supports bone density, immune response, testosterone production, and mood regulation. Often paired with K2 for proper calcium metabolism.",
  "Vitamin K2 MK-7": "Directs calcium into bones and teeth rather than arteries. Works synergistically with vitamin D3. The MK-7 form has a longer half-life than MK-4, providing more sustained benefits.",
  "Multivitamin": "A comprehensive blend of essential vitamins and minerals to fill nutritional gaps in the diet. Supports overall health, energy metabolism, and immune function.",
  "Vitamin B-Complex": "B vitamins are crucial for energy production, brain function, and cell metabolism. Includes B1, B2, B3, B5, B6, B7, B9, and B12 — each playing distinct roles in converting food into energy.",

  // Minerals
  "Magnesium": "Involved in over 300 enzymatic reactions. Supports sleep quality, muscle relaxation, stress reduction, and heart health. Most people don't get enough from diet alone.",
  "Magnesium Glycinate": "A highly absorbable form of magnesium bound to glycine. Known for its calming effects — excellent for sleep, anxiety reduction, and muscle recovery without the laxative effect of other forms.",
  "Magnesium L-Threonate": "The only form of magnesium that effectively crosses the blood-brain barrier. Studied for cognitive enhancement, memory improvement, and synaptic plasticity. Often taken in the evening.",
  "Magnesium Threonate": "The only form of magnesium proven to significantly raise brain magnesium levels. Supports learning, memory, and cognitive function. Popularized by neuroscientists for its brain-specific benefits.",
  "Zinc": "Essential for immune function, testosterone production, wound healing, and protein synthesis. Commonly taken with magnesium (ZMA formula) for sleep and recovery.",
  "Electrolytes": "Minerals including sodium, potassium, magnesium, and calcium that regulate nerve function, muscle contraction, hydration, and pH balance. Critical during fasting, exercise, or low-carb diets.",
  "Sodium": "Essential electrolyte for fluid balance, nerve transmission, and muscle function. Often supplemented during fasting or low-carb diets when the body excretes more sodium.",

  // Omega-3s
  "Fish Oil": "Rich in EPA and DHA omega-3 fatty acids. Reduces inflammation, supports brain health, improves cardiovascular markers, and may enhance mood. Look for IFOS-certified products for purity.",
  "Omega-3": "Essential fatty acids (EPA and DHA) that the body cannot produce. Critical for brain structure, heart health, and reducing systemic inflammation. Most commonly sourced from fish oil or algae.",
  "Fish Oil / Omega-3": "High-quality omega-3 fatty acids support brain function, reduce inflammation, and protect cardiovascular health. EPA and DHA are the active forms — look for products with at least 1g combined EPA/DHA.",
  "Krill Oil": "Omega-3s from Antarctic krill, bound to phospholipids for potentially better absorption than standard fish oil. Also contains astaxanthin, a powerful antioxidant.",

  // Amino Acids
  "Creatine": "One of the most researched supplements in existence. Increases phosphocreatine stores for ATP regeneration — improving strength, power output, and muscle growth. Also shows cognitive benefits, particularly with sleep deprivation.",
  "Creatine Monohydrate": "The most studied and effective form of creatine. Supports muscle strength, power output, and exercise performance. Emerging research also shows cognitive benefits, particularly under sleep deprivation or mental fatigue.",
  "L-Theanine": "An amino acid found in green tea that promotes relaxation without sedation. Often paired with caffeine to enhance focus while reducing jitters. Supports alpha brain wave activity associated with calm alertness.",
  "L-Tyrosine": "A precursor to dopamine, norepinephrine, and adrenaline. Supports cognitive performance under stress, sleep deprivation, or cold exposure. Popular for focus and mental clarity.",
  "L-Glutamine": "The most abundant amino acid in the body. Supports gut health, immune function, and muscle recovery. Often used by athletes to reduce muscle soreness and by those with digestive issues.",
  "Glycine": "A calming amino acid that supports sleep quality, collagen production, and detoxification. Often paired with magnesium for enhanced sleep benefits. Also a precursor to glutathione.",
  "Collagen powder": "Provides the amino acids (glycine, proline, hydroxyproline) needed for skin elasticity, joint health, and connective tissue repair. Type I and III collagen support skin, hair, nails, and bones.",
  "BCAAs": "Branched-chain amino acids (leucine, isoleucine, valine) that support muscle protein synthesis and reduce exercise fatigue. Most beneficial when training fasted or on low protein diets.",
  "Beta-Alanine": "Increases muscle carnosine levels, which buffer acid buildup during high-intensity exercise. Improves performance in efforts lasting 1-4 minutes. Causes a harmless tingling sensation (paresthesia).",

  // Nootropics & Cognitive
  "Alpha-GPC": "A highly bioavailable choline source that increases acetylcholine levels in the brain. Supports focus, memory, and power output. Popular among those seeking cognitive enhancement and athletes.",
  "Caffeine": "The world's most widely consumed psychoactive substance. Blocks adenosine receptors to promote alertness, improve reaction time, and enhance exercise performance. Best cycled to prevent tolerance.",
  "Nicotinamide Riboside": "A NAD+ precursor that supports cellular energy production, DNA repair, and healthy aging. NR is one of the most efficient ways to boost NAD+ levels, which decline with age.",
  "NMN": "Nicotinamide mononucleotide — a direct precursor to NAD+, the coenzyme critical for cellular energy, DNA repair, and longevity pathways. NAD+ levels decline significantly with age.",
  "Resveratrol": "A polyphenol found in red wine and grapes. Activates sirtuins (longevity proteins) and provides antioxidant protection. Often paired with NMN for synergistic anti-aging effects.",
  "Nootropic Blend": "A combination of cognitive-enhancing compounds designed to improve focus, memory, processing speed, and mental clarity. Formulas vary but typically include choline sources, adaptogens, and amino acids.",
  "Alpha Brain": "A popular nootropic blend containing L-theanine, L-tyrosine, phosphatidylserine, and cat's claw. Promoted for focus, memory, and mental processing speed.",
  "Urolithin A": "A postbiotic that improves mitochondrial health by triggering mitophagy — the clearance of damaged mitochondria. Produced by gut bacteria from ellagitannins found in pomegranates.",

  // Antioxidants
  "Alpha-Lipoic Acid": "A potent antioxidant that is both water and fat soluble, allowing it to work throughout the body. Supports mitochondrial function, blood sugar regulation, and may help regenerate other antioxidants like vitamin C and glutathione.",
  "ALA": "Alpha-lipoic acid is a universal antioxidant that works in both water and fat-soluble environments. Supports glucose metabolism, nerve health, and mitochondrial function.",
  "CoQ10": "Coenzyme Q10 is essential for mitochondrial energy production. Levels decline with age and statin use. The ubiquinol form is more absorbable than ubiquinone.",
  "Curcumin": "The active compound in turmeric with powerful anti-inflammatory and antioxidant properties. Best absorbed when paired with piperine (black pepper) or formulated with lipid delivery systems.",
  "Sulforaphane / Broccoli Sprout Supplement": "A potent Nrf2 activator that upregulates the body's own antioxidant defenses. Derived from broccoli sprouts, which contain 20-50x more glucoraphanin (the precursor) than mature broccoli.",
  "Cocoa Extract / Flavanols": "Rich in epicatechin and other flavanols that improve blood flow, cognitive function, and cardiovascular health. Also supports nitric oxide production for better circulation.",
  "NAC": "N-Acetyl Cysteine is a precursor to glutathione, the body's master antioxidant. Supports liver detoxification, respiratory health, and may help with compulsive behaviors.",
  "NAC + Ginger + Curcumin": "A combination antioxidant and anti-inflammatory stack. NAC supports glutathione production, ginger aids digestion and reduces inflammation, and curcumin provides broad anti-inflammatory effects.",

  // Proteins & Greens
  "Collagen": "The most abundant protein in the body, providing structure to skin, joints, bones, and connective tissue. Supplementation supports skin elasticity, joint comfort, and gut health.",
  "Whey Protein": "A complete, fast-digesting protein rich in BCAAs. Ideal for muscle repair and growth post-workout. Also highly satiating for weight management.",
  "Protein Powder": "Convenient source of complete protein for muscle repair, satiety, and meeting daily protein targets. Types include whey, casein, plant-based blends, and collagen.",
  "Athletic Greens AG1": "A comprehensive greens powder with 75 vitamins, minerals, and whole-food-sourced ingredients. Includes probiotics, digestive enzymes, adaptogens, and superfoods.",
  "AG1": "Athletic Greens' flagship all-in-one supplement with 75 ingredients including vitamins, minerals, probiotics, digestive enzymes, and adaptogens. Designed to replace multiple supplements with one daily drink.",
  "Greens Powder": "A blend of dehydrated vegetables, grasses, algae, and sometimes probiotics and enzymes. Provides phytonutrients and alkalizing compounds to supplement a whole-foods diet.",
  "MCT Oil": "Medium-chain triglycerides that are rapidly absorbed and converted to ketones for quick energy. Popular in ketogenic diets and for cognitive performance. Derived from coconut or palm oil.",

  // Probiotics & Gut Health
  "Probiotic": "Beneficial bacteria that support gut microbiome health, digestion, and immune function. Different strains offer different benefits — look for multi-strain formulas with documented CFU counts.",
  "Digestive Enzymes": "Enzymes that help break down fats, proteins, and carbohydrates for better nutrient absorption. Particularly helpful for those with digestive issues or eating large meals.",
  "Fiber Supplement": "Dietary fiber supports digestive regularity, feeds beneficial gut bacteria, and helps regulate blood sugar and cholesterol. Most people consume less than the recommended 25-30g daily.",

  // Hormones & Adaptogens
  "Ashwagandha": "An adaptogenic herb that helps the body manage stress by modulating cortisol levels. Also supports thyroid function, testosterone levels, and sleep quality.",
  "Adaptogen Blend": "A combination of herbs (like ashwagandha, rhodiola, holy basil) that help the body adapt to physical, chemical, and biological stressors by normalizing physiological processes.",
  "Rhodiola Rosea": "An adaptogenic herb known for reducing fatigue, improving mental performance under stress, and supporting physical endurance. Particularly effective for burnout recovery.",
  "Melatonin": "The sleep hormone that regulates circadian rhythm. Supplementation can help with falling asleep faster, particularly for jet lag, shift work, or delayed sleep phase.",
  "DHEA": "A precursor hormone to testosterone and estrogen that declines with age. Sometimes supplemented for vitality and hormone optimization, though research on benefits is mixed.",

  // Other
  "Lutein + Zeaxanthin": "Carotenoids that accumulate in the retina and protect against blue light damage and age-related macular degeneration. Found naturally in leafy greens and egg yolks.",
};

const supplements = db.prepare("SELECT id, product_name, brand, category FROM supplements").all() as any[];

let updated = 0;
for (const s of supplements) {
  let desc = descriptions[s.product_name];

  // Try matching without brand-specific variants
  if (!desc) {
    for (const [key, val] of Object.entries(descriptions)) {
      if (s.product_name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(s.product_name.toLowerCase())) {
        desc = val;
        break;
      }
    }
  }

  if (desc) {
    db.prepare("UPDATE supplements SET description = ? WHERE id = ?").run(desc, s.id);
    updated++;
    console.log(`  ✓ ${s.product_name} (${s.brand})`);
  } else {
    console.log(`  ✗ ${s.product_name} (${s.brand}) — no match`);
  }
}

console.log(`\n✅ Updated ${updated} of ${supplements.length} supplements`);