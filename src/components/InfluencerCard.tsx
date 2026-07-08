import Link from "next/link";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

export function InfluencerCard({
  influencer,
  rank,
}: {
  influencer: {
    id: string;
    full_name: string;
    channel_name: string;
    profile_image_url?: string | null;
    subscriber_count?: string | null;
    category_tags?: string[];
    stack_count?: number;
    avg_confidence?: string;
  };
  rank?: number;
}) {
  return (
    <Link
      href={`/influencers/${influencer.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-gray-400 hover:shadow-md transition-all"
    >
      {/* ── Mobile layout (<640px) — stacked vertical ── */}
      <div className="flex flex-col sm:hidden">
        {/* Header row: avatar (with rank badge) + name/channel */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {influencer.profile_image_url ? (
              <img
                src={influencer.profile_image_url}
                alt={influencer.full_name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-base">
                {influencer.full_name.charAt(0)}
              </div>
            )}
            {rank !== undefined && (
              <div className="absolute -top-1.5 -left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-bold ring-2 ring-white">
                {rank}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-base leading-snug">
              {influencer.full_name}
            </h3>
            <p className="text-sm text-gray-500 truncate leading-snug mt-0.5">
              {influencer.channel_name}
            </p>
          </div>
        </div>

        {/* Bottom row: tags (max 2) + supp count */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {(influencer.category_tags || [])
              .slice(0, 2)
              .map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600"
                >
                  {tag}
                </span>
              ))}
          </div>
          <span className="text-sm font-medium text-gray-500 shrink-0">
            {influencer.stack_count ?? 0} supps
          </span>
          {influencer.avg_confidence && (
            <ConfidenceBadge confidence={influencer.avg_confidence as "high" | "medium" | "low"} />
          )}
        </div>
      </div>

      {/* ── Desktop layout (≥640px) — horizontal, unchanged ── */}
      <div className="hidden sm:flex items-start gap-4">
        {influencer.profile_image_url ? (
          <img
            src={influencer.profile_image_url}
            alt={influencer.full_name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
            {influencer.full_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {influencer.full_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {influencer.channel_name}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {(influencer.category_tags || [])
              .slice(0, 3)
              .map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-medium text-gray-900">
            {influencer.stack_count ?? 0} supps
          </div>
          {influencer.avg_confidence && (
            <div className="mt-1">
              <ConfidenceBadge confidence={influencer.avg_confidence as "high" | "medium" | "low"} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}