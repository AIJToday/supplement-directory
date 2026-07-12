import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInfluencerBySlug, getInfluencerStack } from "@/lib/db";
import { influencerMetadata } from "@/lib/metadata";
import { InfluencerSchema, BreadcrumbSchema } from "@/components/SchemaOrg";
import { AdPlaceholder } from "@/components/AdPlaceholder";

export const dynamic = "force-dynamic";

// Time-of-day ordering for grouping
const TIME_ORDER = ["Morning", "With Breakfast", "Afternoon", "Evening"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const inf = getInfluencerBySlug(slug);
  if (!inf) return {};
  const stack = getInfluencerStack(slug) as any[];
  return influencerMetadata({
    full_name: inf.full_name,
    channel_name: inf.channel_name,
    bio: inf.bio,
    stack_count: stack.length,
    slug,
  });
}

export default async function InfluencerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const inf = getInfluencerBySlug(slug);
  if (!inf) notFound();

  const stack = getInfluencerStack(slug) as any[];

  // Group by time_of_day
  const grouped: Record<string, any[]> = {};
  for (const entry of stack) {
    const tod = entry.time_of_day || "Unspecified";
    if (!grouped[tod]) grouped[tod] = [];
    grouped[tod].push(entry);
  }

  // Sort groups by TIME_ORDER
  const sortedGroups = TIME_ORDER.filter((t) => grouped[t]).concat(
    Object.keys(grouped).filter((t) => !TIME_ORDER.includes(t))
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to Ranking
      </Link>

      {/* Header — centered, blue name, portrait */}
      <div className="text-center space-y-4">
        {inf.profile_image_url && (
          <img
            src={inf.profile_image_url}
            alt={inf.full_name}
            className="mx-auto h-32 w-32 rounded-lg object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-blue-600">{inf.full_name}</h1>

        {/* Birth year integrated into bio as first sentence */}
        {inf.bio && (
          <p className="text-gray-600 max-w-lg mx-auto text-sm">
            {inf.birth_year
              ? `Born in ${inf.birth_year}, ${inf.bio.charAt(0).toLowerCase() + inf.bio.slice(1)}`
              : inf.bio}
          </p>
        )}
        {!inf.bio && inf.birth_year && (
          <p className="text-gray-600 max-w-lg mx-auto text-sm">
            Born in {inf.birth_year}.
          </p>
        )}

        <a
          href={inf.channel_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          YouTube Channel
        </a>
        {inf.subscriber_count && (
          <p className="text-sm text-gray-400">{inf.subscriber_count} subscribers</p>
        )}
        {inf.category_tags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {inf.category_tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Supplement Table */}
      {stack.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">
            No supplements catalogued for this influencer yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-sm" style={{ backgroundColor: "#f8f9fa" }}>
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-3 text-left font-bold text-gray-900 w-[12%]">
                  Time of Day
                </th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 w-[28%]">
                  Supplement
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 w-[22%]">
                  Reported Dose / Timing
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 w-[23%]">
                  Reported Brand
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-900 w-[25%]">
                  Comparable Alternative
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGroups.map((timeOfDay) =>
                grouped[timeOfDay].map((entry: any, idx: number) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {idx === 0 ? timeOfDay : ""}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 align-top text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span>{entry.supplement?.product_name || "—"}</span>
                        {entry.supplement?.amazon_url && (
                          <a
                            href={entry.supplement.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded bg-amber-400 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-amber-500 transition-colors"
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13.5 21v-7.5H21V21h-7.5zM3 21v-7.5h7.5V21H3zm0-10.5V3h7.5v7.5H3zm10.5 0V3H21v7.5h-7.5z"/>
                            </svg>
                            Amazon
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {entry.dosage || ""}
                      {entry.frequency && (
                        <>
                          <br />
                          <span className="text-xs text-gray-500">
                            {entry.frequency}
                          </span>
                        </>
                      )}
                      {entry.timing && !entry.time_of_day && (
                        <span className="text-xs text-gray-500">
                          {entry.timing}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 align-top">
                      {entry.supplement?.brand || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 align-top">
                      {entry.comparable_alternative || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mid-content Ad Slot */}
      <AdPlaceholder size="leaderboard" bannerSrc="/ad-mid.jpg" />

      {/* Scroll indicator */}
      {stack.length > 10 && (
        <div className="flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Source note */}
      <p className="text-center text-xs text-gray-400">
        Data sourced from publicly available YouTube videos and interviews.{" "}
        <Link href="/about" className="underline hover:text-gray-600">
          Full disclaimer
        </Link>
      </p>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: inf.full_name,
            description: inf.bio || `${inf.full_name} is a YouTube content creator in the health & wellness space.`,
            url: inf.channel_url,
            sameAs: [inf.channel_url],
            ...(inf.subscriber_count
              ? {
                  interactionStatistic: {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/FollowAction",
                    userInteractionCount: inf.subscriber_count,
                  },
                }
              : {}),
          }),
        }}
      />
    </div>
  );
}