import Link from "next/link";
import type { Metadata } from "next";
import { getAllSupplements } from "@/lib/db";
import { baseMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = baseMetadata({
  title: "All Supplements by Category",
  description: "Browse every supplement tracked in the Daily Dose Directory, organized by category. Compare brands, dosages, and see which influencers take each supplement.",
});

export default function SupplementsPage() {
  const supplements = getAllSupplements() as any[];

  // Group by category
  const byCategory: Record<string, any[]> = {};
  for (const s of supplements) {
    const cat = s.category || "Uncategorized";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(s);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplements</h1>
        <p className="mt-2 text-gray-600">
          Browse all supplements tracked across influencers.
        </p>
      </div>

      {supplements.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">No supplements catalogued yet</p>
          <p className="text-gray-400 text-sm">
            Supplements will appear here as influencers are added.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => (
              <section key={category}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {category}
                </h2>
                <div className="grid gap-2">
                  {items.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/supplements/${s.id}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {s.product_name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{s.brand}</span>
                      </div>
                      {s.form && (
                        <span className="text-xs text-gray-400">{s.form}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}