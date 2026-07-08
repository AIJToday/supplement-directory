import { getAllInfluencers, getAllSupplements } from "@/lib/db";
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dailydosedirectory.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const influencers = getAllInfluencers();
  const supplements = getAllSupplements();

  const influencerUrls: MetadataRoute.Sitemap = influencers.map((inf: any) => ({
    url: `${BASE_URL}/influencers/${inf.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const supplementUrls: MetadataRoute.Sitemap = supplements.map((supp: any) => ({
    url: `${BASE_URL}/supplements/${supp.id}`,
    lastModified: new Date(),
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