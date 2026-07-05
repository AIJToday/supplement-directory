import type { Metadata } from "next";

const SITE = {
  name: "Supplement Directory",
  description:
    "The #1 directory of what top health influencers actually take every day. See exact brands, dosages, timing, and budget-friendly alternatives.",
  url: "https://supplementdirectory.com",
};

export function baseMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: `${SITE.name} — YouTube Influencer Supplement Stacks`,
      template: `%s — ${SITE.name}`,
    },
    description: SITE.description,
    metadataBase: new URL(SITE.url),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: overrides?.title
        ? String(
            typeof overrides.title === "string"
              ? overrides.title
              : (overrides.title as any)?.default || SITE.name
          )
        : `${SITE.name} — YouTube Influencer Supplement Stacks`,
      description: overrides?.description || SITE.description,
    },
    twitter: {
      card: "summary_large_image",
      title: overrides?.title
        ? String(
            typeof overrides.title === "string"
              ? overrides.title
              : (overrides.title as any)?.default || SITE.name
          )
        : SITE.name,
      description: overrides?.description || SITE.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: overrides?.alternates?.canonical || "/",
    },
    ...overrides,
  };
}

export function influencerMetadata(inf: {
  full_name: string;
  channel_name: string;
  bio?: string;
  stack_count?: number;
  slug: string;
}): Metadata {
  const title = `${inf.full_name} Supplement Stack — Dosages, Brands & Timing`;
  const description = inf.bio
    ? `${inf.full_name} (${inf.channel_name}) takes ${inf.stack_count || "several"} supplements including detailed dosages, brands, time-of-day timing, and comparable budget alternatives. ${inf.bio.slice(0, 120)}`
    : `${inf.full_name} (${inf.channel_name}) takes ${inf.stack_count || "several"} supplements. See exact dosages, brands, timing, and budget-friendly alternatives.`;

  return baseMetadata({
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    alternates: { canonical: `/influencers/${inf.slug}` },
  });
}

export function supplementMetadata(supp: {
  product_name: string;
  brand: string;
  category: string;
  user_count?: number;
  id: number;
}): Metadata {
  const title = `${supp.product_name} by ${supp.brand} — Which Influencers Take It`;
  const description = `${supp.user_count || "Several"} YouTube health influencers take ${supp.product_name} (${supp.brand}, ${supp.category}). Compare dosages and timing across influencers.`;

  return baseMetadata({
    title,
    description,
    alternates: { canonical: `/supplements/${supp.id}` },
  });
}