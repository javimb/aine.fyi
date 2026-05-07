"use client";

import { useTranslations } from "next-intl";
import CompoundPill from "@/components/compound-pill";
import StatusBanner from "@/components/status-banner";
import type { SearchResult } from "@/components/search-bar";
import { normalizePactivos } from "@/lib/aine-matcher";

const STATUS_STYLES = {
  RED: {
    bg: "bg-status-red-bg",
    text: "text-status-red",
  },
  AMBER: {
    bg: "bg-status-amber-bg",
    text: "text-status-amber",
  },
  GREEN: {
    bg: "bg-status-green-bg",
    text: "text-status-green",
  },
  YELLOW: {
    bg: "bg-status-yellow-bg",
    text: "text-status-yellow",
  },
} as const;

interface ResultCardProps {
  result: SearchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const t = useTranslations("status");
  const { nombre, pactivos, aineAnalysis } = result;
  const status = aineAnalysis.status;
  const style = STATUS_STYLES[status];
  const matchedAines = aineAnalysis.matchedAines ?? [];

  const statusKey = status as "RED" | "AMBER" | "GREEN" | "YELLOW";

  const tokens = pactivos.split(",").map((t) => t.trim());
  const normalizedTokens = normalizePactivos(pactivos);
  const usedMatches = new Set<number>();

  const pills = tokens.map((token, index) => {
    const normalized = normalizedTokens[index];
    const matchIndex = matchedAines.findIndex(
      (m, i) => !usedMatches.has(i) && m.name === normalized,
    );

    if (matchIndex !== -1) {
      usedMatches.add(matchIndex);
      const match = matchedAines[matchIndex];
      return (
        <CompoundPill
          key={index}
          name={match.name}
          family={match.family}
          level={match.level}
        />
      );
    }

    return <CompoundPill key={index} name={token} family="" level="NEUTRAL" />;
  });

  return (
    <div
      role="article"
      aria-label={`${nombre} — ${t(`${statusKey}.ariaLabel`)}`}
      className={`rounded-lg ${style.bg} p-4`}
    >
      <StatusBanner banner={t(`${statusKey}.banner`)} textClass={style.text} />
      <h3 className="text-lg font-bold">{nombre}</h3>

      <div className="mt-2">
        <div
          role="list"
          aria-label={t("activeIngredientsLabel")}
          className="flex flex-wrap gap-1.5"
        >
          {pills}
        </div>
      </div>

      <p className={`mt-3 text-sm font-medium ${style.text}`}>
        {t(`${statusKey}.message`)}
      </p>
    </div>
  );
}
