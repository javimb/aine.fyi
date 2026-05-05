"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultList from "@/components/result-list";

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

interface SearchFormProps {
  isHero: boolean;
  onModeChange: (hero: boolean) => void;
}

export default function SearchForm({ isHero, onModeChange }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/cima?nombre=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.resultados) {
        setResults(data.resultados);
      } else if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults([data]);
      }
      onModeChange(false);
    } catch {
      setError("Error al buscar");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setError("");
    onModeChange(true);
  }

  return (
    <>
      <form
        onSubmit={handleSearch}
        aria-label="Buscar medicamento"
        aria-busy={loading}
        className="flex w-full max-w-2xl gap-2"
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value && results.length === 0) {
              onModeChange(true);
            }
          }}
          placeholder="Buscar medicamento..."
          aria-label="Nombre del medicamento"
          className={isHero ? "h-12 text-lg" : "h-10"}
        />
        <Button
          type="submit"
          disabled={loading}
          className={isHero ? "h-12 px-6" : "h-10"}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
        {!isHero && results.length > 0 && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        )}
      </form>

      {error && (
        <p role="alert" aria-live="polite" className="text-status-red text-sm">
          {error}
        </p>
      )}

      {results.length > 0 && !error && (
        <div className="mt-4 w-full max-w-2xl">
          <ResultList results={results} />
        </div>
      )}
    </>
  );
}
