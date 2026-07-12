import Link from "next/link";
import type { Metadata } from "next";
import { getSupplementsByBrand } from "@/lib/db";
import { baseMetadata } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/SchemaOrg";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand);
  const supps = getSupplementsByBrand(decodedBrand) as any[];
  return baseMetadata({
    title: `${decodedBrand} — Supplements, Products & Who Takes Them`,
    description: `${decodedBrand} has ${supps.length} product${supps.length !== 1 ? "s" : ""} tracked in the Daily Dose Directory. See which YouTube health influencers use ${decodedBrand} supplements, with dosages and timing.`,
    alternates: { canonical: `/brands/${brand}` },
  });
}

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
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.dailydosedirectory.com" },
          { name: "Brands", url: "https://www.dailydosedirectory.com/brands" },
          { name: decodedBrand, url: `https://www.dailydosedirectory.com/brands/${brand}` },
        ]}
      />
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