import Link from "next/link";
import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { getAllInfluencers, getInfluencersByCategory } from "@/lib/db";
import { InfluencerCard } from "@/components/InfluencerCard";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { DirectoryItemListSchema } from "@/components/SchemaOrg";
import { baseMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = baseMetadata();

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;

  const influencers = category
    ? getInfluencersByCategory(category)
    : getAllInfluencers();

  return (
    <div className="space-y-6">
      <DirectoryItemListSchema influencers={influencers} />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplement Directory</h1>
        <p className="mt-1 text-gray-600">
          The #1 directory of supplements the top health influencers actually take every day. See exact brands, dosages, timing &amp; budget-friendly alternatives.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px]">
          <SearchBar placeholder="Search influencers by name or channel..." />
        </div>
        <FilterBar />
      </div>

      {influencers.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">No influencers found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {influencers.length} influencer{influencers.length !== 1 && "s"} · Ranked by YouTube subscribers
          </p>

          <div className="grid gap-5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((inf: any, idx: number) => (
              <div key={inf.id} className="flex items-stretch gap-2 h-full">
                <div className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-gray-100 text-gray-500 self-start">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <InfluencerCard influencer={inf} rank={idx + 1} />
                </div>
              </div>
            ))}
          </div>

          {/* Ad Slot — Bottom of page, below all influencer cards */}
          <AdPlaceholder size="leaderboard" bannerSrc="/ad-mid.jpg" />

          <p className="text-xs text-gray-400">
            <Link href="/about" className="underline hover:text-gray-600">
              About &amp; disclaimer
            </Link>
          </p>
        </>
      )}
    </div>
  );
}