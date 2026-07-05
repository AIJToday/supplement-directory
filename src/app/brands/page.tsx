import Link from "next/link";
import { getAllBrands } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function BrandsPage() {
  const brands = getAllBrands();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
        <p className="mt-2 text-gray-600">
          Browse supplement brands and see which influencers use them.
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">No brands catalogued yet</p>
          <p className="text-gray-400 text-sm">
            Brands will appear here as supplements are added.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map(({ brand, count }) => (
            <Link
              key={brand}
              href={`/brands/${encodeURIComponent(brand)}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <span className="font-medium text-gray-900">{brand}</span>
              <span className="text-sm text-gray-500">
                {count} product{count !== 1 && "s"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}