interface CompoundPillProps {
  name: string;
  family: string;
  level: "RED" | "AMBER";
}

export default function CompoundPill({
  name,
  family,
  level,
}: CompoundPillProps) {
  const bgClass =
    level === "RED"
      ? "bg-status-red-bg text-status-red border border-status-red-border"
      : "bg-status-amber-bg text-status-amber border border-status-amber-border";

  return (
    <span
      role="listitem"
      aria-label={`${name}, ${family}`}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bgClass}`}
    >
      {name} · {family}
    </span>
  );
}
