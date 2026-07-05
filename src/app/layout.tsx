import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { OrganizationSchema } from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Supplement Directory — What Influencers Actually Take",
  description:
    "A transparent directory of YouTube influencers and their daily supplement routines. Every entry sourced from videos with timestamps and sponsorship flags.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              💊 Supplement Directory
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Rankings
              </Link>
              <Link href="/supplements" className="hover:text-gray-900 transition-colors">
                Supplements
              </Link>
              <Link href="/brands" className="hover:text-gray-900 transition-colors">
                Brands
              </Link>
              <Link href="/about" className="hover:text-gray-900 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Ad Slot — Top Banner */}
        <div className="mx-auto max-w-6xl px-4 py-3">
          <AdPlaceholder size="leaderboard" bannerSrc="/ad-top.jpg" />
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <DisclaimerBar />

        <footer className="border-t border-gray-200 mt-16">
          <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
            Supplement Directory · Data sourced from public YouTube videos ·
            We do not endorse any supplement.{" "}
            <Link href="/about" className="underline hover:text-gray-700">
              Full disclaimer
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}