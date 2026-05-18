"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultList from "@/components/result-list";
import EmptyResults from "@/components/empty-results";

export interface SearchResult {
  nombre: string;
  pactivos: string;
  aineAnalysis: {
    status: "RED" | "AMBER" | "GREEN" | "YELLOW";
    matchedAines?: Array<{
      name: string;
      family: string;
      level: "RED" | "AMBER";
    }>;
  };
}

export default function SearchBar() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setIsEmpty(false);

    try {
      const res = await fetch(`/api/cima?nombre=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.resultados) {
        setResults(data.resultados);
        setIsEmpty(data.resultados.length === 0);
      } else if (data.error) {
        setError(data.error);
        setResults([]);
        setIsEmpty(false);
      } else {
        setResults([data]);
        setIsEmpty(false);
      }
    } catch {
      setError(t("error"));
      setResults([]);
      setIsEmpty(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSearch}
        aria-label={t("formLabel")}
        aria-busy={loading}
        className="flex w-full gap-2"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("inputLabel")}
          className="h-12 text-lg"
        />
        <Button type="submit" disabled={loading} className="h-12 px-6">
          {loading ? t("buttonLoading") : t("button")}
        </Button>
      </form>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-2 text-status-red text-sm"
        >
          {error}
        </p>
      )}

      {isEmpty && !error && <EmptyResults />}

      {results.length > 0 && !error && (
        <div ref={resultsRef} className="mt-4">
          <ResultList results={results} />
        </div>
      )}
    </div>
  );
}
