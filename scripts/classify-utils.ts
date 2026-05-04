export type Level = "RED" | "AMBER" | "YELLOW" | "GREEN";

export const LEVEL_ORDER: Record<Level, number> = {
  RED: 3,
  AMBER: 2,
  YELLOW: 1,
  GREEN: 0,
};

export const ATC_FAMILY_MAP: Record<string, string> = {
  M01AA: "Pirazolona",
  M01AB: "Acético",
  M01AC: "Oxicam",
  M01AE: "Propiónico",
  M01AG: "Fenamato",
  M01AH: "Coxib",
  M01AX: "Otros AINE",
};

const SALICILATO_FAMILY = "Salicilato";

export function getAtcFamily(
  atcCode: string,
  familyMap?: Record<string, string>,
): string {
  const resolvedFamilyMap = familyMap ?? ATC_FAMILY_MAP;
  for (const [prefix, family] of Object.entries(resolvedFamilyMap)) {
    if (atcCode.startsWith(prefix)) {
      return family;
    }
  }
  return "Otros AINE";
}

export function classifyPrincipio(
  atcCodes: Set<string> | undefined,
  familyMap?: Record<string, string>,
): { level: Level; family: string } {
  if (!atcCodes || atcCodes.size === 0) {
    return { level: "YELLOW", family: "" };
  }

  let maxLevel: Level = "GREEN";
  let family = "";

  for (const atc of atcCodes) {
    if (atc.startsWith("M01A")) {
      if (LEVEL_ORDER.RED > LEVEL_ORDER[maxLevel]) {
        maxLevel = "RED";
        family = getAtcFamily(atc, familyMap);
      }
    } else if (atc === "B01AC06" || atc.startsWith("N02BA")) {
      if (LEVEL_ORDER.AMBER > LEVEL_ORDER[maxLevel]) {
        maxLevel = "AMBER";
        family = SALICILATO_FAMILY;
      }
    }
  }

  return { level: maxLevel, family };
}

export function mergeAtcCodes(
  singleAtc: Set<string>,
  comboAtc: Set<string>,
  principioCode: number,
  singleMap: Map<number, Set<string>>,
): Set<string> {
  const aineRelatedPrefixes = ["M01A", "N02BA", "B01AC06"];
  const merged = new Set<string>();

  for (const atc of singleAtc) {
    merged.add(atc);
  }

  for (const atc of comboAtc) {
    if (aineRelatedPrefixes.some((p) => atc.startsWith(p) || atc === p)) {
      const singleCodes = singleMap.get(principioCode);
      if (singleCodes && singleCodes.has(atc)) {
        merged.add(atc);
      }
    } else {
      merged.add(atc);
    }
  }

  return merged;
}
