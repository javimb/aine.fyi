"use client";

import { useState } from "react";

interface SearchResult {
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

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`/api/cima?nombre=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.resultados) {
        setResults(data.resultados);
      } else if (data.error) {
        setError(data.error);
      } else {
        setResults([data]);
      }
    } catch {
      setError("Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar medicamento..."
          className="flex-1 rounded border px-3 py-2"
          data-testid="search-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          data-testid="search-button"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <p className="text-red-600" data-testid="error-message">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2" data-testid="search-results">
          {results.map((r, i) => (
            <li key={i} className="rounded border p-3">
              <p className="font-semibold">{r.nombre}</p>
              <p className="text-sm text-gray-600">{r.pactivos}</p>
              <p
                className={`mt-1 font-bold ${
                  r.aineAnalysis.status === "RED"
                    ? "text-red-600"
                    : r.aineAnalysis.status === "AMBER"
                      ? "text-amber-600"
                      : r.aineAnalysis.status === "GREEN"
                        ? "text-green-600"
                        : "text-yellow-600"
                }`}
                data-testid="aine-status"
                data-aine-status={r.aineAnalysis.status}
              >
                {r.aineAnalysis.status === "RED"
                  ? `⚠️ AINE detectado: ${r.aineAnalysis.matchedAines?.map((a) => a.name).join(", ")}`
                  : r.aineAnalysis.status === "AMBER"
                    ? `⚠️ Salicilato: ${r.aineAnalysis.matchedAines?.map((a) => a.name).join(", ")}`
                    : r.aineAnalysis.status === "GREEN"
                      ? "✅ No es un AINE"
                      : "⚠️ Estado desconocido"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
