import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search", "/admin"],
    },
    sitemap: "https://www.dailydosedirectory.com/sitemap.xml",
  };
}