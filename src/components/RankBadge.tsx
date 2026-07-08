const RIBBON_STYLES: Record<
  number,
  { bg: string; text: string; tail: string; label: string }
> = {
  1: {
    bg: "bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600",
    text: "text-yellow-900",
    tail: "border-t-yellow-600",
    label: "1st",
  },
  2: {
    bg: "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500",
    text: "text-gray-700",
    tail: "border-t-gray-500",
    label: "2nd",
  },
  3: {
    bg: "bg-gradient-to-b from-orange-400 via-amber-500 to-amber-800",
    text: "text-amber-900",
    tail: "border-t-amber-800",
    label: "3rd",
  },
};

export function RankBadge({ rank }: { rank: number }) {
  // Top 3 get ribbon treatment
  if (rank <= 3) {
    const s = RIBBON_STYLES[rank];
    return (
      <div className="flex flex-col items-center shrink-0 mt-2">
        {/* Ribbon body */}
        <div
          className={`relative flex h-6 w-8 items-center justify-center rounded-sm ${s.bg} shadow-sm`}
        >
          <span
            className={`text-[10px] font-extrabold tracking-tight ${s.text}`}
          >
            {s.label}
          </span>
          {/* Ribbon tails — two triangles below */}
          <span
            className={`absolute -bottom-1 left-0 h-0 w-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent ${s.tail}`}
          />
          <span
            className={`absolute -bottom-1 right-0 h-0 w-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent ${s.tail}`}
          />
        </div>
      </div>
    );
  }

  // Ranks 4+ get a simple gray circle
  return (
    <div className="hidden sm:flex mt-3 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
      {rank}
    </div>
  );
}