interface AdPlaceholderProps {
  size?: "leaderboard" | "rectangle" | "skyscraper";
  className?: string;
  /** Override banner image. Pass null to hide the photo entirely. */
  bannerSrc?: string | null;
}

const SIZE_CLASSES = {
  leaderboard: "h-[90px]",
  rectangle: "h-[250px]",
  skyscraper: "h-[600px] w-[160px]",
} as const;

export function AdPlaceholder({ size = "leaderboard", className = "", bannerSrc = "/ad-banner.jpg" }: AdPlaceholderProps) {
  const height = SIZE_CLASSES[size];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 ${height} ${className}`}
    >
      {/* Subtle top-left label */}
      <span className="absolute top-1.5 left-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-300 select-none z-10">
        Advertisement
      </span>

      {/* Banner photo for leaderboard */}
      {size === "leaderboard" && bannerSrc !== null && (
        <img
          src={bannerSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
    </div>
  );
}