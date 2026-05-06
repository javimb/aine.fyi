import type { PrincipleClassification } from "../../data/aine-classification.schema";

export type Level = "RED" | "AMBER" | "YELLOW" | "GREEN";

export type AineAnalysis = {
  status: Level;
  matchedAines: Array<{ name: string; family: string; level: "RED" | "AMBER" }>;
};

const LEVEL_ORDER: Record<Level, number> = {
  RED: 3,
  AMBER: 2,
  YELLOW: 1,
  GREEN: 0,
};

export function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizePactivos(pactivos: string): string[] {
  return pactivos
    .split(",")
    .map((token) => stripAccents(token.trim().toUpperCase()));
}

export const YELLOW_ANALYSIS: AineAnalysis = {
  status: "YELLOW",
  matchedAines: [],
};

export function matchAines(
  pactivos: string | undefined | null,
  classification: PrincipleClassification,
): AineAnalysis {
  if (!pactivos || pactivos.trim() === "") {
    return { status: "YELLOW", matchedAines: [] };
  }

  const normalizedTokens = normalizePactivos(pactivos);

  const matchedAines: AineAnalysis["matchedAines"] = [];
  let overallLevel: Level = "GREEN";
  let hasUnknown = false;

  for (const token of normalizedTokens) {
    const entry = classification[token];
    if (!entry) {
      hasUnknown = true;
      continue;
    }

    const { level, family } = entry;
    if (level === "RED" || level === "AMBER") {
      matchedAines.push({ name: token, family, level });
    }

    if (LEVEL_ORDER[level] > LEVEL_ORDER[overallLevel]) {
      overallLevel = level;
    }
  }

  if (hasUnknown && overallLevel === "GREEN") {
    overallLevel = "YELLOW";
  }

  return {
    status: overallLevel,
    matchedAines: matchedAines.length > 0 ? matchedAines : [],
  };
}
