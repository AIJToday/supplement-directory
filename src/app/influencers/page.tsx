import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { InfluencerCard } from "@/components/InfluencerCard";
import { getAllInfluencers, getInfluencersByCategory } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function InfluencersPage({
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Influencers</h1>
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
            Showing {influencers.length} influencer{influencers.length !== 1 && "s"}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((inf: any, idx: number) => (
              <div key={inf.id} className="flex items-start gap-2 h-full">
                <div
                  className={`mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx < 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <InfluencerCard influencer={inf} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}