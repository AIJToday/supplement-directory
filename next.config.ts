import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // better-sqlite3 is a native module — exclude it from webpack bundling
  serverExternalPackages: ["better-sqlite3"],
  async redirects() {
    return [
      {
        source: "/influencers",
        destination: "/",
        permanent: true,
      },
      // Redirect orphan/duplicate supplement pages to their active counterparts
      { source: "/supplements/2", destination: "/supplements/59", permanent: true },
      { source: "/supplements/3", destination: "/supplements/12", permanent: true },
      { source: "/supplements/6", destination: "/supplements/18", permanent: true },
      { source: "/supplements/7", destination: "/supplements/20", permanent: true },
      { source: "/supplements/8", destination: "/supplements/19", permanent: true },
      { source: "/supplements/30", destination: "/supplements/17", permanent: true },
      { source: "/supplements/34", destination: "/supplements/33", permanent: true },
    ];
  },
};

export default nextConfig;
