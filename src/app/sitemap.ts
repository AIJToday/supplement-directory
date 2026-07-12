import { getAllInfluencers, getAllSupplements, getDb } from "@/lib/db";
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dailydosedirectory.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const influencers = getAllInfluencers();
  const db = getDb();
  // Exclude orphan supplements (no influencers use them)
  const supplements = db
    .prepare(
      `SELECT s.* FROM supplements s
       WHERE EXISTS (SELECT 1 FROM influencer_supplements WHERE supplement_id = s.id)
       ORDER BY s.product_name`
    )
    .all() as any[];

  const influencerUrls: MetadataRoute.Sitemap = influencers.map((inf: any) => ({
    url: `${BASE_URL}/influencers/${inf.id}`,
    lastModified: inf.updated_at ? new Date(inf.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const supplementUrls: MetadataRoute.Sitemap = supplements.map((supp: any) => ({
    url: `${BASE_URL}/supplements/${supp.id}`,
    lastModified: supp.updated_at ? new Date(supp.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/supplements`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...influencerUrls,
    ...supplementUrls,
  ];
}