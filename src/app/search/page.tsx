import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import { searchAll } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q;

  if (!query) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search</h1>
          <p className="mt-2 text-gray-600">
            Search across influencers and supplements.
          </p>
        </div>
        <SearchBar placeholder="e.g. 'vitamin d', 'huberman', 'magnesium'..." />
      </div>
    );
  }

  const results = searchAll(query) as { influencers: any[]; supplements: any[] };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="mt-2 text-gray-600">
          Results for &ldquo;{query}&rdquo;
        </p>
      </div>

      <SearchBar placeholder="Search again..." />

      {results.influencers.length === 0 && results.supplements.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">No results found</p>
          <p className="text-gray-400 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {results.influencers.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Influencers ({results.influencers.length})
              </h2>
              <div className="grid gap-2">
                {results.influencers.map((inf: any) => (
                  <Link
                    key={inf.id}
                    href={`/influencers/${inf.id}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    {inf.profile_image_url && (
                      <img
                        src={inf.profile_image_url}
                        alt={inf.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{inf.full_name}</div>
                      <div className="text-sm text-gray-500">{inf.channel_name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.supplements.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Supplements ({results.supplements.length})
              </h2>
              <div className="grid gap-2">
                {results.supplements.map((supp: any) => (
                  <Link
                    key={supp.id}
                    href={`/supplements/${supp.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <span className="font-medium text-gray-900">
                      {supp.product_name}
                    </span>
                    <span className="text-sm text-gray-500">{supp.brand}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}