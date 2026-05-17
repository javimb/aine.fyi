"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultList from "@/components/result-list";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";

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

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: SearchResult[] }
  | { status: "empty"; query: string }
  | { status: "error"; message: string };

export default function SearchBar() {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
  });
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      ["success", "empty", "error"].includes(searchState.status) &&
      feedbackRef.current
    ) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchState]);

  function handleRetry() {
    if (query.trim())
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchState({ status: "loading" });

    try {
      const res = await fetch(`/api/cima?nombre=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.resultados) {
        setSearchState(
          data.resultados.length > 0
            ? { status: "success", results: data.resultados }
            : { status: "empty", query },
        );
      } else if (data.error) {
        setSearchState({ status: "error", message: data.error });
      } else {
        setSearchState({ status: "success", results: [data] });
      }
    } catch {
      setSearchState({ status: "error", message: t("error") });
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSearch}
        aria-label={t("formLabel")}
        aria-busy={searchState.status === "loading"}
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
        <Button
          type="submit"
          disabled={searchState.status === "loading"}
          className="h-12 px-6"
        >
          {searchState.status === "loading" ? t("buttonLoading") : t("button")}
        </Button>
      </form>

      {searchState.status === "success" && (
        <div ref={feedbackRef} className="mt-4">
          <ResultList results={searchState.results} />
        </div>
      )}
      {searchState.status === "empty" && (
        <div ref={feedbackRef}>
          <EmptyState query={searchState.query} />
        </div>
      )}
      {searchState.status === "error" && (
        <div ref={feedbackRef}>
          <ErrorState message={searchState.message} onRetry={handleRetry} />
        </div>
      )}
    </div>
  );
}
