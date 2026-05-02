import type { AineBlacklist } from "../../data/aines.schema";

export type AineAnalysis = {
  status: "RED" | "GREEN" | "YELLOW";
  matchedAines: Array<{ name: string; family: string }>;
};

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizePactivos(pactivos: string): string[] {
  return pactivos
    .split(",")
    .map((token) => stripAccents(token.trim().toUpperCase()));
}

export function matchAines(
  pactivos: string | undefined | null,
  blacklist: AineBlacklist,
): AineAnalysis {
  if (!pactivos || pactivos.trim() === "") {
    return { status: "YELLOW", matchedAines: [] };
  }

  const normalizedTokens = normalizePactivos(pactivos);

  const matchedAines: Array<{ name: string; family: string }> = [];

  for (const entry of blacklist) {
    const isMatch = entry.cimaNames.some((cimaName) =>
      normalizedTokens.includes(cimaName),
    );
    if (isMatch) {
      matchedAines.push({ name: entry.name, family: entry.family });
    }
  }

  if (matchedAines.length > 0) {
    return { status: "RED", matchedAines };
  }

  return { status: "GREEN", matchedAines: [] };
}
