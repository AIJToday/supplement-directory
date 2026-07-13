import type { Metadata } from "next";
import { getAllSupplements } from "@/lib/db";
import { baseMetadata } from "@/lib/metadata";
import { SupplementSearchList } from "@/components/SupplementSearchList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = baseMetadata({
  title: "All Supplements by Category",
  description: "Browse every supplement tracked in the Daily Dose Directory, organized by category. Compare brands, dosages, and see which influencers take each supplement.",
});

export default function SupplementsPage() {
  const supplements = getAllSupplements() as any[];

  return (
    <div className="space-y-6">
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
        <SupplementSearchList supplements={supplements} />
      )}
    </div>
  );
}