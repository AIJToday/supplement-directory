"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "Vitamins",
  "Minerals",
  "Omega-3s",
  "Protein & Amino Acids",
  "Nootropics",
  "Adaptogens",
  "Antioxidants & Longevity",
  "Probiotics & Gut",
  "Herbal & Botanicals",
  "Performance",
  "Sleep",
  "Joint & Mobility",
];

const CONFIDENCE_OPTIONS = ["high", "medium", "low"];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeConfidence = searchParams.get("confidence") || "";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/influencers?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category filter */}
      <select
        value={activeCategory}
        onChange={(e) => setFilter("category", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat.toLowerCase()}>
            {cat}
          </option>
        ))}
      </select>

      {/* Confidence filter */}
      <select
        value={activeConfidence}
        onChange={(e) => setFilter("confidence", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="">All confidence levels</option>
        {CONFIDENCE_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)} confidence
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {(activeCategory || activeConfidence) && (
        <button
          onClick={() => router.push("/influencers")}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}