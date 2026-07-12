"""Add factual, educational descriptions to supplements missing them."""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "directory.db")
db = sqlite3.connect(DB_PATH)

# Descriptions are educational — what the supplement is, why people take it.
# No medical claims, no dosage recommendations.
DESCRIPTIONS = {
    # ATHLEAN-X
    145: "ATHLEAN-Rx Whey Protein is a high-quality whey protein isolate designed to support muscle recovery and growth after training. Whey is a fast-digesting complete protein containing all essential amino acids. It is commonly used to meet daily protein targets, particularly around workouts.",
    146: "Creatine monohydrate is one of the most researched sports supplements. It helps replenish ATP, the primary energy currency of cells, supporting short bursts of high-intensity exercise like weightlifting and sprinting. ATHLEAN-Rx Creatine is a pure creatine monohydrate formulation.",
    147: "A comprehensive daily multivitamin from the ATHLEAN-X line, formulated to fill common micronutrient gaps in active individuals. Multivitamins provide a broad spectrum of vitamins and minerals that support overall health and training recovery.",

    # Ancient Nutrition
    152: "Bone broth protein powder derived from chicken bone broth, providing collagen, glucosamine, chondroitin, and amino acids. It offers a protein source that also supports joint, gut, and skin health, different from traditional whey or plant proteins.",
    151: "A blend of collagen proteins sourced from multiple animal types (bovine, chicken, fish, and eggshell membrane). Collagen is a structural protein important for skin elasticity, joint cushioning, and connective tissue integrity.",
    153: "A probiotic supplement providing beneficial bacteria intended to support digestive health and a balanced gut microbiome. Probiotics are live microorganisms that may aid digestion and immune function.",

    # Avmacol
    34: "Sulforaphane is a bioactive compound derived from broccoli sprouts, studied for its potential role in activating the body's Nrf2 antioxidant pathway. Avmacol provides a standardized source of glucoraphanin, the precursor to sulforaphane.",

    # Bare Performance Nutrition
    191: "Creatine monohydrate from Bare Performance Nutrition, a staple sports supplement used to support high-intensity exercise performance, muscle strength, and power output. It works by increasing phosphocreatine stores in muscle tissue.",
    193: "An electrolyte supplement designed to replenish sodium, potassium, and other minerals lost through sweat during training. Electrolytes are essential for hydration, muscle contraction, and nerve signaling.",
    192: "A pre-workout supplement formulated with ingredients intended to increase energy, focus, and blood flow during training. BPN Flight uses clinically-dosed ingredients like citrulline, beta-alanine, and caffeine.",
    190: "Whey protein powder from Bare Performance Nutrition, a complete protein source used to support muscle repair, recovery, and daily protein intake. Whey is rapidly absorbed and rich in branched-chain amino acids.",

    # Blueprint
    8: "Cocoa flavanols are plant compounds found in cocoa beans studied for their antioxidant properties and potential cardiovascular benefits. Blueprint's cocoa flavanols are part of Bryan Johnson's documented longevity protocol.",
    6: "Blueprint Essential Capsules are part of Bryan Johnson's comprehensive supplement protocol, designed to fill micronutrient gaps as part of a broader longevity-focused regimen. The specific formulation targets foundational vitamin and mineral needs.",
    18: "Blueprint Essential Capsules are part of Bryan Johnson's comprehensive supplement protocol, designed to fill micronutrient gaps as part of a broader longevity-focused regimen that includes dozens of daily supplements.",
    17: "Blueprint Longevity Mix is a custom-blended supplement powder from Bryan Johnson's Blueprint protocol, formulated to deliver multiple nutrients in a single serving as part of his documented anti-aging and health-optimization regimen.",

    # Bulletproof
    38: "Liposomal glutathione is formulated for enhanced absorption of glutathione, a tripeptide that functions as a major endogenous antioxidant in the body. Liposomal delivery encapsulates the glutathione to improve bioavailability.",
    39: "PQQ (Pyrroloquinoline Quinone) is a compound that supports mitochondrial function and biogenesis — the creation of new mitochondria in cells. It is often taken for its potential role in cellular energy production and neuroprotection.",

    # Doctor's Best
    156: "Glucosamine and chondroitin are compounds naturally found in joint cartilage, commonly supplemented for joint comfort and mobility. Doctor's Best formulation combines both in a single supplement.",

    # Dr. Berg's
    89: "Cod liver oil is a traditional supplement rich in omega-3 fatty acids (EPA and DHA), vitamin A, and vitamin D. It has been used for generations to support immune function, bone health, and cardiovascular wellness.",
    85: "A high-potassium electrolyte powder from Dr. Berg's product line, designed to support hydration and electrolyte balance. Potassium is a key electrolyte involved in nerve transmission, muscle contraction, and fluid regulation.",
    88: "Dr. Berg's Gallbladder Formula contains bile salts and digestive enzymes to support fat digestion and gallbladder function. Bile salts help emulsify dietary fats so they can be properly broken down and absorbed.",
    87: "Nutritional yeast is a deactivated yeast rich in B-complex vitamins, protein, and minerals. It has a savory, cheese-like flavor and is often used as a seasoning or supplement for its broad nutritional profile.",

    # Euvexia
    132: "Apple cider vinegar capsules provide acetic acid in a convenient form. Apple cider vinegar has been a popular traditional remedy and is commonly taken for its potential to support blood sugar regulation and digestion.",
    134: "A B-complex supplement providing the full spectrum of B vitamins, which are water-soluble and essential for energy metabolism, red blood cell formation, and neurological function. The B vitamins must be obtained regularly through diet or supplementation.",
    128: "Euvexia Electrolyte Powder is formulated to replenish key minerals — sodium, potassium, and magnesium — lost during physical activity and sweating. Proper electrolyte balance is critical for hydration status and muscle function.",
    130: "Magnesium citrate is a well-absorbed form of magnesium, an essential mineral involved in over 300 enzymatic reactions in the body. It is commonly taken for muscle relaxation, sleep support, and digestive regularity.",
    131: "Omega-3 fish oil provides the long-chain fatty acids EPA and DHA, which are important for cardiovascular health, brain function, and regulating inflammation. Fish oil is one of the most widely studied dietary supplements.",
    133: "A probiotic supplement providing strains of beneficial gut bacteria. Probiotics are live microorganisms intended to support and maintain a healthy digestive system and balanced gut flora.",
    129: "Vitamin D3 combined with vitamin K2 — a synergistic pairing where D3 supports calcium absorption and K2 helps direct calcium to bones rather than soft tissues. Both are fat-soluble vitamins important for bone and cardiovascular health.",

    # Fit Father Project
    166: "Fit Father Greens is a powdered greens supplement formulated to help busy men meet their daily vegetable and micronutrient intake. Greens powders typically blend leafy greens, vegetables, fruits, and herbs into a convenient drink.",
    167: "A daily multivitamin from the Fit Father Project designed for men over 40, formulated to address common nutrient gaps that may occur with aging. Multivitamins provide a broad foundation of vitamins and minerals.",
    168: "An omega-3 supplement from the Fit Father Project providing EPA and DHA fatty acids from fish oil. Omega-3s are important for heart health, brain function, and controlling inflammation, and are commonly recommended for middle-aged and older adults.",

    # Gorilla Mind
    68: "Gorilla Mind Smooth is a nootropic formulation designed to enhance cognitive performance, focus, and mental clarity. Nootropics are compounds taken to support various aspects of brain function including memory, attention, and processing speed.",
    67: "Gorilla Mode is a high-stimulant pre-workout formulation designed to increase energy, pump, and focus during training. It contains a blend of ingredients including citrulline, creatine, caffeine, and nootropic compounds.",
    174: "A pre-workout supplement from Gorilla Mind formulated to enhance training intensity, mental focus, and muscular endurance. Pre-workouts typically combine stimulants, amino acids, and performance-enhancing compounds.",

    # Gundry MD
    176: "Gundry MD Bio Complete 3 is a three-in-one formulation combining probiotics, prebiotics, and postbiotics designed to support gut health from multiple angles. It targets digestive comfort, regularity, and the gut microbiome.",
    177: "Gundry MD Energy Renew is a supplement formulated to support mitochondrial health and cellular energy production. It typically contains compounds like CoQ10, PQQ, and other nutrients involved in the body's energy pathways.",
    175: "Gundry MD Vital Reds is a polyphenol-rich blend of red fruits, berries, and botanical extracts formulated to support overall wellness. It provides a concentrated source of antioxidants from a wide variety of fruit sources.",
    178: "Vitamin D3 combined with vitamin K2 from Gundry MD. D3 supports calcium absorption and immune function, while K2 helps direct calcium to bones and teeth rather than accumulating in blood vessels.",

    # HLTH Code
    185: "HLTH Code Complete Meal is a meal replacement shake formulated with a science-backed ratio of protein, healthy fats, and fiber. It is designed to provide complete nutrition in a convenient format for busy individuals.",

    # Heart & Soil
    115: "Beef liver capsules are a desiccated organ supplement providing nutrients naturally concentrated in liver, including highly bioavailable vitamin A, B12, iron, and copper. Organ meats are among the most nutrient-dense foods available.",
    111: "Heart & Soil's Desiccated Organs is a blend of freeze-dried organ tissues from grass-fed sources, providing the unique nutrients found in various animal organs. This 'nose-to-tail' approach aims to deliver nutrients that are scarce in modern diets.",
    112: "Magnesium glycinate is a chelated form of magnesium bound to glycine, known for high bioavailability and gentle effect on digestion. It is commonly chosen for its calming properties and support for sleep quality.",
    113: "Vitamin D3 plus K2 from Heart & Soil. D3 is essential for calcium metabolism and immune function; K2 helps direct calcium to bones. Both are fat-soluble vitamins that work synergistically in the body.",

    # Jarrow Formulas
    28: "Methylfolate is the bioactive form of folate (vitamin B9), which does not require conversion by the body. It is important for DNA synthesis, red blood cell formation, and nervous system function. Methylfolate is preferred by individuals with MTHFR gene variants.",

    # Kion
    54: "Kion Aminos provides a blend of essential amino acids (EAAs) in free-form, designed for rapid absorption to support muscle protein synthesis, recovery, and energy during exercise. EAAs cannot be made by the body and must come from diet or supplementation.",
    53: "Kion Clean Energy Bar is a whole-food-based protein and energy bar formulated without artificial ingredients, designed to provide sustained energy from quality protein, healthy fats, and natural carbohydrates.",
    55: "Kion Flex is a joint support supplement formulated with ingredients like glucosamine, chondroitin, and turmeric to support joint comfort and mobility, particularly in active individuals.",

    # LMNT
    114: "LMNT Electrolyte Powder is a high-sodium electrolyte drink mix formulated for people following low-carb, keto, or active lifestyles. It provides sodium, potassium, and magnesium without sugar or artificial ingredients.",
    66: "An electrolyte supplement providing sodium, potassium, and magnesium in a science-backed ratio. Electrolytes are essential minerals that support hydration, muscle function, nerve signaling, and blood pressure regulation.",

    # Momentous
    15: "Apigenin is a bioactive flavonoid found in chamomile, parsley, and other plants. It has been studied for its potential to promote sleep quality and reduce anxiety by interacting with GABA receptors in the brain.",

    # NOW Foods
    170: "Magnesium citrate from NOW Foods, a widely available and well-absorbed form of magnesium. Magnesium supports muscle relaxation, nerve function, energy production, and sleep quality.",
    155: "Vitamin C (ascorbic acid) from NOW Foods. Vitamin C is a water-soluble antioxidant essential for immune function, collagen synthesis, and iron absorption. It cannot be produced by the human body and must be obtained from diet.",

    # Nordic Naturals
    202: "Omega-3 algae oil provides EPA and DHA from a sustainable, plant-based source — making it suitable for vegetarians and vegans. Algae oil offers the same omega-3 benefits as fish oil without the fish.",

    # Outwork Nutrition
    117: "Creatine monohydrate from Outwork Nutrition, a pure form of one of the most extensively studied sports supplements. Creatine supports ATP regeneration during high-intensity exercise, improving strength, power, and muscle recovery.",
    116: "Outwork Pre-Workout is formulated to increase energy, mental focus, and muscular endurance before training. It combines stimulants, amino acids, and performance-enhancing ingredients for an effective training session.",
    121: "Outwork Sleep+ Recovery is formulated to support restful sleep and overnight recovery. Quality sleep is essential for muscle repair, hormone regulation, and cognitive function.",
    118: "Whey protein isolate from Outwork Nutrition, a fast-digesting complete protein that supports muscle repair and recovery after training. Whey isolate is filtered to contain minimal fat and lactose.",

    # Prescription
    50: "Metformin is a prescription medication primarily used to manage type 2 diabetes by improving insulin sensitivity and reducing liver glucose production. Some longevity researchers study it for its potential effects on aging pathways, but it is not approved for this use.",

    # Pure Encapsulations
    204: "Omega-3 fish oil from Pure Encapsulations providing EPA and DHA. Pure Encapsulations products are formulated without unnecessary additives and undergo rigorous testing for quality and purity.",

    # RP Strength
    127: "Magnesium glycinate from RP Strength, a highly bioavailable form of magnesium bound to glycine. This form is commonly chosen for its calming effects on the nervous system and support for quality sleep.",
    126: "Omega-3 fish oil from RP Strength providing EPA and DHA fatty acids to support cardiovascular health, brain function, and a healthy inflammatory response.",
    122: "RP Creatine Monohydrate is a pure creatine supplement from Renaissance Periodization, a company focused on evidence-based sports nutrition. Creatine supports strength, power output, and lean body mass when combined with resistance training.",
    124: "RP Pre-Workout is formulated to enhance training performance through ingredients that support energy production, focus, and muscular endurance during workouts.",
    123: "RP Whey Protein from Renaissance Periodization, a high-quality protein source designed to support muscle recovery, repair, and daily protein targets for athletes and fitness enthusiasts.",
    125: "Vitamin D3 from RP Strength. Vitamin D is a fat-soluble vitamin essential for calcium absorption, bone health, and immune system function. Many people have insufficient levels, especially in winter months.",

    # Thorne
    135: "Thorne Research Multivitamin is a comprehensive daily nutrient supplement known for its high-quality ingredient sourcing and formulation standards. It provides a broad spectrum of essential vitamins and minerals in bioavailable forms.",
    120: "Omega-3 fish oil from Thorne Research, a well-regarded supplement brand that supplies many professional sports teams. Their fish oil provides EPA and DHA fatty acids and is tested for purity and potency.",

    # Various
    161: "An electrolyte blend providing sodium, potassium, and magnesium — the three primary electrolytes lost through sweat. Maintaining electrolyte balance is important for hydration, muscle contraction, nerve function, and preventing cramps.",
    162: "Vitamin D3 is a fat-soluble vitamin synthesized in skin upon sun exposure and obtained through certain foods. It plays a critical role in calcium absorption, bone density, immune function, and mood regulation.",

    # Various (self-assembled)
    30: "A custom-blended micronutrient smoothie assembled from various individual ingredients, tailored to personal nutritional needs. This approach allows for personalized dosing and ingredient selection based on individual goals.",
}

for supp_id, desc in DESCRIPTIONS.items():
    db.execute("UPDATE supplements SET description = ? WHERE id = ?", (desc, supp_id))

db.commit()
updated = len(DESCRIPTIONS)
print(f"Updated {updated} supplements with descriptions")

# Verify
missing = db.execute("SELECT COUNT(*) FROM supplements WHERE description IS NULL OR description = ''").fetchone()[0]
print(f"Still missing: {missing}")

db.close()
