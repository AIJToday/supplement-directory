import Link from "next/link";
import type { Metadata } from "next";
import { getSupplementById, getSupplementUsers, getRelatedSupplements } from "@/lib/db";
import { supplementMetadata } from "@/lib/metadata";
import { BreadcrumbSchema } from "@/components/SchemaOrg";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supp = getSupplementById(parseInt(id, 10)) as any;
  if (!supp) return {};
  const users = getSupplementUsers(parseInt(id, 10)) as any[];
  return supplementMetadata({
    product_name: supp.product_name,
    brand: supp.brand,
    category: supp.category,
    user_count: users.length,
    id: supp.id,
  });
}

export default async function SupplementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplementId = parseInt(id, 10);

  const supp = getSupplementById(supplementId) as any;
  if (!supp) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900">Supplement not found</h1>
        <Link href="/supplements" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to supplements
        </Link>
      </div>
    );
  }

  const users = getSupplementUsers(supplementId) as any[];
  const related = getRelatedSupplements(supp.category, supp.id, 5) as any[];

  return (
    <div className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.dailydosedirectory.com" },
          { name: "Supplements", url: "https://www.dailydosedirectory.com/supplements" },
          { name: supp.product_name, url: `https://www.dailydosedirectory.com/supplements/${supp.id}` },
        ]}
      />

      <BreadcrumbNav
        items={[
          { name: "Home", url: "/" },
          { name: "Supplements", url: "/supplements" },
          { name: supp.product_name, url: `/supplements/${supp.id}` },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{supp.product_name}</h1>
        <p className="text-gray-600 mt-1">
          {supp.brand} · {supp.category}
          {supp.form && ` · ${supp.form}`}
        </p>
        {supp.amazon_url && (
          <a
            href={supp.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-500 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 21v-7.5H21V21h-7.5zM3 21v-7.5h7.5V21H3zm0-10.5V3h7.5v7.5H3zm10.5 0V3H21v7.5h-7.5z"/>
            </svg>
            Amazon
          </a>
        )}
      </div>

      {/* What it does */}
      {supp.description && (
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            What it does &amp; why it matters
          </h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            {supp.description}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Influencers who take this ({users.length})
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No influencers tracked for this supplement yet.</p>
        ) : (
          <div className="grid gap-3">
            {users.map((entry: any) => (
              <Link
                key={entry.id}
                href={`/influencers/${entry.influencer.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  {entry.influencer.profile_image_url && (
                    <img
                      src={entry.influencer.profile_image_url}
                      alt={entry.influencer.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {entry.influencer.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.influencer.channel_name}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  {entry.dosage && <div>{entry.dosage}</div>}
                  {entry.frequency && (
                    <div className="text-xs text-gray-400">{entry.frequency}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Related Supplements */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Related {supp.category} supplements
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {related.map((r: any) => (
              <Link
                key={r.id}
                href={`/supplements/${r.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div>
                  <span className="font-medium text-gray-900">{r.product_name}</span>
                  <span className="ml-2 text-xs text-gray-400">{r.brand}</span>
                </div>
                <span className="text-xs text-gray-500">{r.user_count} influencer{r.user_count !== 1 ? "s" : ""}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}