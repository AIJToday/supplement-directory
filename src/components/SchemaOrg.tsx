import type { InfluencerWithStack } from "@/lib/types";

/**
 * JSON-LD structured data for Google rich results.
 * Renders as an invisible <script> tag in the <head>.
 */

/* ── Homepage / Directory ── */

export function OrganizationSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Supplement Directory",
    url: "https://www.dailydosedirectory.com",
    description:
      "A transparent directory of YouTube health & wellness influencers and their documented daily supplement routines — with dosages, brands, timing, and comparable alternatives.",
    foundingDate: "2025",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function DirectoryItemListSchema({
  influencers,
}: {
  influencers: Array<{
    id: string;
    full_name: string;
    channel_name: string;
    stack_count?: number;
  }>;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "YouTube Influencer Supplement Stacks",
    description:
      "The #1 directory of what top health influencers actually take every day. See exact brands, dosages, timing, and budget-friendly alternatives.",
    numberOfItems: influencers.length,
    itemListElement: influencers.map((inf, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: inf.full_name,
        url: `https://www.dailydosedirectory.com/influencers/${inf.id}`,
        description: `${inf.channel_name} — ${inf.stack_count ?? 0} documented supplements`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/* ── Influencer Detail Pages ── */

export function InfluencerSchema(inf: InfluencerWithStack) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: inf.full_name,
    url: `https://www.dailydosedirectory.com/influencers/${inf.id}`,
    description: inf.bio || `${inf.channel_name} — ${inf.stack_count} documented supplements`,
    image: inf.profile_image_url
      ? `https://www.dailydosedirectory.com${inf.profile_image_url}`
      : undefined,
    affiliation: {
      "@type": "Organization",
      name: inf.channel_name,
      url: inf.channel_url,
    },
    ...(inf.supplements?.length > 0 && {
      subjectOf: inf.supplements.map((entry) => ({
        "@type": "Drug",
        name: entry.supplement.product_name,
        manufacturer: {
          "@type": "Organization",
          name: entry.supplement.brand,
        },
        ...(entry.dosage && { dosageForm: entry.dosage }),
        ...(entry.time_of_day && {
          drugUnit: entry.time_of_day,
        }),
        ...(entry.comparable_alternative && {
          funding: {
            "@type": "DrugCost",
            name: `Budget alternative: ${entry.comparable_alternative}`,
          },
        }),
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/* ── Breadcrumb ── */

export function BreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}