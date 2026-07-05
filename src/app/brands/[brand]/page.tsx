import Link from "next/link";
import { getSupplementsByBrand } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);
  const supps = getSupplementsByBrand(decodedBrand) as any[];

  return (
    <div className="space-y-8">
      <Link href="/brands" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to all brands
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{decodedBrand}</h1>
        <p className="mt-1 text-gray-600">
          {supps.length} product{supps.length !== 1 && "s"} tracked
        </p>
      </div>

      {supps.length === 0 ? (
        <p className="text-gray-500">No products from this brand tracked yet.</p>
      ) : (
        <div className="grid gap-2">
          {supps.map((s: any) => (
            <Link
              key={s.id}
              href={`/supplements/${s.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <div>
                <span className="font-medium text-gray-900">{s.product_name}</span>
                <span className="ml-2 text-sm text-gray-500">{s.category}</span>
              </div>
              {s.form && <span className="text-xs text-gray-400">{s.form}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}