import SearchBar from "@/components/search-bar";
import AineExplainer from "@/components/aine-explainer";
import Disclaimer from "@/components/disclaimer";
import DataSource from "@/components/data-source";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="flex w-full max-w-2xl flex-col items-center gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">¿Es un AINE?</h1>
        <p className="text-muted-foreground">
          Comprueba si un medicamento contiene algún AINE
        </p>
      </div>
      <SearchBar />
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
