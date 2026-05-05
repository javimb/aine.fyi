export type Level = "RED" | "AMBER" | "YELLOW" | "GREEN";

export const LEVEL_ORDER: Record<Level, number> = {
  RED: 3,
  AMBER: 2,
  YELLOW: 1,
  GREEN: 0,
};

export function getAtcFamily(
  atcCode: string,
  familyMap: Record<string, string>,
): string {
  for (const [prefix, family] of Object.entries(familyMap)) {
    if (atcCode.startsWith(prefix)) {
      return family;
    }
  }
  return "Otros AINE";
}

export function classifyPrincipio(
  atcCodes: Set<string> | undefined,
  familyMap: Record<string, string>,
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
        const lookupCode = atc.startsWith("N02BA") ? atc : "N02BA";
        family = getAtcFamily(lookupCode, familyMap);
      }
    }
  }

  return { level: maxLevel, family };
}

export function updateReadmeMarker(content: string, date: string): string {
  const markerPattern = /<!-- last-updated: \d{4}-\d{2}-\d{2} -->/;
  const dateLinePattern = /Principios activos last updated: \d{4}-\d{2}-\d{2}/;

  const newMarker = `<!-- last-updated: ${date} -->`;
  const newDateLine = `Principios activos last updated: ${date}`;

  if (markerPattern.test(content)) {
    let updated = content.replace(markerPattern, newMarker);
    if (dateLinePattern.test(updated)) {
      updated = updated.replace(dateLinePattern, newDateLine);
    }
    return updated;
  }

  if (dateLinePattern.test(content)) {
    return content.replace(dateLinePattern, `${newDateLine} ${newMarker}`);
  }

  const fullLine = `${newDateLine} ${newMarker}`;
  const tableEndPattern = /\| 🟡.*\|\n/;
  const tableMatch = content.match(tableEndPattern);
  if (tableMatch && tableMatch.index !== undefined) {
    const insertPos = tableMatch.index + tableMatch[0].length;
    return (
      content.slice(0, insertPos) +
      "\n" +
      fullLine +
      "\n" +
      content.slice(insertPos)
    );
  }

  return content + "\n" + fullLine + "\n";
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
