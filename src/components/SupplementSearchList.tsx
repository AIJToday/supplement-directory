"use client";

import { useState } from "react";
import Link from "next/link";

interface Supplement {
  id: number;
  product_name: string;
  brand: string;
  category: string;
  form?: string;
}

export function SupplementSearchList({
  supplements,
}: {
  supplements: Supplement[];
}) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? supplements.filter((s) => {
        const q = query.toLowerCase();
        return (
          s.product_name.toLowerCase().includes(q) ||
          (s.brand && s.brand.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q))
        );
      })
    : supplements;

  // Group filtered by category
  const byCategory: Record<string, Supplement[]> = {};
  for (const s of filtered) {
    const cat = s.category || "Uncategorized";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(s);
  }

  return (
    <>
      {/* Search input */}
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter supplements by name, brand, or category..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-11 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 text-lg">No supplements match your search</p>
          <p className="text-gray-400 text-sm">
            Try a different name, brand, or category.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCategory)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => (
              <section key={category} id={`cat-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {category}
                </h2>
                <div className="grid gap-2">
                  {items.map((s) => (
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
    </>
  );
}