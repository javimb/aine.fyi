import CompoundPill from "@/components/compound-pill";
import StatusBanner from "@/components/status-banner";
import type { SearchResult } from "@/components/search-bar";
import { normalizePactivos } from "@/lib/aine-matcher";

const STATUS_CONFIG = {
  RED: {
    border: "border-l-status-red-border",
    bg: "bg-status-red-bg",
    text: "text-status-red",
    banner: "🔴 AINE DETECTADO",
    message:
      "⚠️ Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico.",
  },
  AMBER: {
    border: "border-l-status-amber-border",
    bg: "bg-status-amber-bg",
    text: "text-status-amber",
    banner: "🟠 SALICILATO DETECTADO",
    message:
      "⚠️ Los salicilatos pueden provocar reacción cruzada con alergia a AINE. Consulta con tu farmacéutico.",
  },
  GREEN: {
    border: "border-l-status-green-border",
    bg: "bg-status-green-bg",
    text: "text-status-green",
    banner: "🟢 LIBRE DE AINE",
    message: "No se han detectado compuestos AINE.",
  },
  YELLOW: {
    border: "border-l-status-yellow-border",
    bg: "bg-status-yellow-bg",
    text: "text-status-yellow",
    banner: "🟡 NO PUDIMOS VERIFICAR",
    message:
      "⚠️ No pudimos verificar los componentes de este medicamento. Consulta con tu farmacéutico.",
  },
} as const;

interface ResultCardProps {
  result: SearchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { nombre, pactivos, aineAnalysis } = result;
  const status = aineAnalysis.status;
  const config = STATUS_CONFIG[status];
  const matchedAines = aineAnalysis.matchedAines ?? [];

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
      aria-label={`${nombre} — ${status === "RED" ? "AINE detectado" : status === "AMBER" ? "Salicilato detectado" : status === "GREEN" ? "Libre de AINE" : "No pudimos verificar"}`}
      className={`rounded-lg border-l-4 ${config.border} ${config.bg} p-4`}
    >
      <StatusBanner banner={config.banner} textClass={config.text} />
      <h3 className="text-lg font-bold">{nombre}</h3>

      <div className="mt-2">
        <p className="text-sm font-medium text-muted-foreground">
          Principios activos:
        </p>
        <div role="list" className="mt-1 flex flex-wrap gap-1.5">
          {pills}
        </div>
      </div>

      <p className={`mt-3 text-sm font-medium ${config.text}`}>
        {config.message}
      </p>
    </div>
  );
}
