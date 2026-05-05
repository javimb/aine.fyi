"use client";

import { useState, useCallback } from "react";
import SearchForm from "@/components/search-form";
import AineExplainer from "@/components/aine-explainer";
import Disclaimer from "@/components/disclaimer";
import DataSource from "@/components/data-source";

export default function Home() {
  const [isHero, setIsHero] = useState(true);
  const handleModeChange = useCallback((hero: boolean) => {
    setIsHero(hero);
  }, []);

  return (
    <main
      className={`flex min-h-dvh flex-col items-center px-4 ${
        isHero ? "justify-center" : "gap-6 py-8"
      }`}
    >
      {isHero && (
        <div className="flex w-full max-w-2xl flex-col items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Es un AINE?
          </h1>
          <p className="text-muted-foreground">
            Comprueba si un medicamento contiene algún AINE
          </p>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <SearchForm isHero={isHero} onModeChange={handleModeChange} />
      </div>
      <div className="w-full max-w-2xl">
        <AineExplainer />
      </div>
      <div className="w-full max-w-2xl">
        <Disclaimer />
      </div>
      <div className="w-full max-w-2xl">
        <DataSource />
      </div>
    </main>
  );
}
