import Link from "next/link";
import { getSupplementById, getSupplementUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SupplementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <SupplementDetailWrapper params={params} />;
}

async function SupplementDetailWrapper({
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

  return (
    <div className="space-y-8">
      <Link href="/supplements" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to all supplements
      </Link>

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
            Buy on Amazon
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
    </div>
  );
}