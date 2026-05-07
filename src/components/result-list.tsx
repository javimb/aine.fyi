"use client";

import { useTranslations } from "next-intl";
import ResultCard from "@/components/result-card";
import type { SearchResult } from "@/components/search-bar";

interface ResultListProps {
  results: SearchResult[];
}

export default function ResultList({ results }: ResultListProps) {
  const t = useTranslations("results");
  const count = results.length;

  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">{t("count", { count })}</h2>
      <div className="space-y-3">
        {results.map((r, i) => (
          <ResultCard key={i} result={r} />
        ))}
      </div>
    </div>
  );
}
