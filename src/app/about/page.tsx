import { BreadcrumbSchema } from "@/components/SchemaOrg";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.dailydosedirectory.com" },
          { name: "About", url: "https://www.dailydosedirectory.com/about" },
        ]}
      />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="mt-2 text-gray-600">
          How this directory works — and what it doesn&apos;t do.
        </p>
      </div>

      {/* Mission */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
        <p className="text-gray-700">
          YouTube influencers shape what millions of people buy and consume. But
          supplement recommendations are often buried in long videos, mixed with
          sponsorships, and hard to verify. This directory collects and organizes
          those recommendations — with full source attribution, timestamps, and
          transparency about affiliations — so you can make informed decisions.
        </p>
      </section>

      {/* Methodology */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Methodology</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900">1. Discovery</h3>
            <p>
              We search YouTube for health, fitness, biohacking, and wellness
              influencers who discuss their supplement routines in detail. We
              prioritize creators who name specific products, brands, and
              dosages.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">2. Extraction</h3>
            <p>
              For each video, we record every supplement mentioned — product
              name, brand, dosage, frequency, and timing. We capture the exact
              video timestamp and a transcript excerpt so you can verify the
              source yourself.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">3. Confidence Rating</h3>
            <p>Every entry receives a confidence rating:</p>
            <ul className="mt-2 space-y-2">
              <li>
                <span className="font-medium text-green-700">High:</span> Product
                shown on camera, name and dosage clearly stated, cross-verified
                across multiple videos.
              </li>
              <li>
                <span className="font-medium text-yellow-700">Medium:</span>{" "}
                Product named but dosage unclear, or only one source, or an
                affiliate relationship exists.
              </li>
              <li>
                <span className="font-medium text-red-700">Low:</span> Vague
                mention, sponsor-heavy list, or stack changes frequently.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              4. Affiliation Transparency
            </h3>
            <p>
              We flag whether the influencer is sponsored by the brand, sells
              their own brand, or uses affiliate links. This helps you
              understand potential bias in their recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="rounded-xl border-2 border-red-200 bg-red-50 p-6 space-y-3">
        <h2 className="text-xl font-semibold text-red-900">
          ⚠️ Medical Disclaimer
        </h2>
        <div className="text-red-800 space-y-2 text-sm">
          <p>
            <strong>
              This website does not provide medical advice, diagnosis, or
              treatment.
            </strong>
          </p>
          <p>
            The information on this site is for informational and educational
            purposes only. It documents what specific YouTube influencers have
            stated publicly about their personal supplement use.
          </p>
          <p>
            <strong>We do not:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Endorse or recommend any supplement, brand, or dosage</li>
            <li>Verify the safety or efficacy of any supplement</li>
            <li>
              Claim that any influencer&apos;s routine is appropriate for anyone
              else
            </li>
            <li>Provide medical or health advice of any kind</li>
          </ul>
          <p>
            Always consult with a qualified healthcare professional before
            starting any supplement regimen. Supplements can interact with
            medications, have side effects, and may not be appropriate for your
            specific health situation.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p className="text-gray-700">
          Found an error? Want to suggest an influencer to add? Have a
          correction? We welcome your input. Please reach out and we&apos;ll
          review it.
        </p>
        <p className="text-gray-500 text-sm">
          This directory is a work in progress. Data is updated periodically as
          new videos are published and re-reviewed.
        </p>
      </section>
    </div>
  );
}