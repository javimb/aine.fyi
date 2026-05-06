import { toTitleCase } from "@/lib/utils";

interface CompoundPillProps {
  name: string;
  family: string;
  level: "RED" | "AMBER" | "NEUTRAL";
}

export default function CompoundPill({
  name,
  family,
  level,
}: CompoundPillProps) {
  const displayName = toTitleCase(name);
  const displayFamily = toTitleCase(family);
  const bgClass =
    level === "RED"
      ? "bg-status-red-bg text-status-red border border-status-red-border"
      : level === "AMBER"
        ? "bg-status-amber-bg text-status-amber border border-status-amber-border"
        : "bg-muted text-muted-foreground border border-muted";

  return (
    <span
      role="listitem"
      aria-label={
        level === "NEUTRAL" ? displayName : `${displayName}, ${displayFamily}`
      }
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bgClass}`}
    >
      {level === "NEUTRAL" ? displayName : `${displayName} · ${displayFamily}`}
    </span>
  );
}
