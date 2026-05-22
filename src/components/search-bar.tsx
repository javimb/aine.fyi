"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultList from "@/components/result-list";
import EmptyResults from "@/components/empty-results";
import { detectQueryType, extractCnFromEan13 } from "@/lib/query-detection";
import BarcodeScannerButton from "@/components/barcode-scanner-button";
import ScannerOverlay from "@/components/scanner-overlay";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { lastDetected } = useBarcodeScanner();

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  useEffect(() => {
    if (lastDetected !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- barcode detected from scanner, must sync to input
      setQuery(lastDetected);
    }
  }, [lastDetected]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setIsEmpty(false);

    const queryType = detectQueryType(trimmed);

    function processResponse(data: Record<string, unknown>) {
      if (data.resultados) {
        setResults(data.resultados as SearchResult[]);
        setIsEmpty((data.resultados as unknown[]).length === 0);
      } else if (data.error) {
        setError(data.error as string);
        setResults([]);
        setIsEmpty(false);
      } else {
        setResults([data as unknown as SearchResult]);
        setIsEmpty(false);
      }
    }

    try {
      let apiUrl: string;
      if (queryType === "cn") {
        apiUrl = `/api/cima?cn=${encodeURIComponent(trimmed)}`;
      } else if (queryType === "ean13") {
        const cn = extractCnFromEan13(trimmed);
        if (cn) {
          apiUrl = `/api/cima?cn=${encodeURIComponent(cn)}`;
        } else {
          apiUrl = `/api/cima?nombre=${encodeURIComponent(trimmed)}`;
        }
      } else {
        apiUrl = `/api/cima?nombre=${encodeURIComponent(trimmed)}`;
      }

      const res = await fetch(apiUrl);
      const data = await res.json();

      const isCnLookup = queryType === "cn" || queryType === "ean13";
      const needsFallback =
        isCnLookup &&
        (res.status === 404 ||
          (data.resultados && data.resultados.length === 0) ||
          (!data.resultados && !data.nombre && !data.error));

      if (needsFallback) {
        const fallbackRes = await fetch(
          `/api/cima?nombre=${encodeURIComponent(trimmed)}`,
        );
        const fallbackData = await fallbackRes.json();
        processResponse(fallbackData);
      } else {
        processResponse(data);
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
        <BarcodeScannerButton onOpenScanner={() => setIsScannerOpen(true)} />
      </form>

      <ScannerOverlay
        open={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

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
