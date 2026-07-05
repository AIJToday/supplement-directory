type Confidence = "high" | "medium" | "low";

const styles: Record<Confidence, { bg: string; text: string; label: string }> = {
  high: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "High confidence",
  },
  medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Medium confidence",
  },
  low: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Low confidence",
  },
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const s = styles[confidence];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
      title={s.label}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            confidence === "high"
              ? "bg-green-500"
              : confidence === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
      </span>
      {confidence}
    </span>
  );
}