import { describe, it, expect } from "vitest";
import {
  classifyPrincipio,
  getAtcFamily,
  mergeAtcCodes,
  updateReadmeMarker,
} from "./classify-utils";
import { generateTsFile } from "./generate-aine-classification";
import { Level } from "./classify-utils";

const ATC_FAMILY_MAP: Record<string, string> = {
  M01AA: "Pirazolona",
  M01AB: "Acético",
  M01AC: "Oxicam",
  M01AE: "Propiónico",
  M01AG: "Fenamato",
  M01AH: "Coxib",
  M01AX: "Otros AINE",
};

const AEMPS_FAMILY_MAP: Record<string, string> = {
  M01AA: "Butilpirazolidinas",
  M01AB: "Derivados del acido acetico y sustancias relacionadas",
  M01AC: "Oxicams",
  M01AE: "Derivados del acido propionico",
  M01AG: "Fenamatos",
  M01AH: "Coxibs",
  M01AX: "Otros agentes antiinflamatorios y antirreumaticos no esteroideos",
  N02BA: "Salicilatos",
};

describe("classifyPrincipio", () => {
  it("returns YELLOW for undefined ATC codes", () => {
    expect(classifyPrincipio(undefined, ATC_FAMILY_MAP)).toEqual({
      level: "YELLOW",
      family: "",
    });
  });

  it("returns YELLOW for empty ATC code set", () => {
    expect(classifyPrincipio(new Set(), ATC_FAMILY_MAP)).toEqual({
      level: "YELLOW",
      family: "",
    });
  });

  it("returns GREEN for non-AINE ATC codes", () => {
    expect(classifyPrincipio(new Set(["N02BE01"]), ATC_FAMILY_MAP)).toEqual({
      level: "GREEN",
      family: "",
    });
  });

  it("classifies M01A ATC codes as RED", () => {
    expect(classifyPrincipio(new Set(["M01AE01"]), ATC_FAMILY_MAP)).toEqual({
      level: "RED",
      family: "Propiónico",
    });
  });

  it("classifies B01AC06 as AMBER", () => {
    expect(classifyPrincipio(new Set(["B01AC06"]), ATC_FAMILY_MAP)).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("classifies N02BA prefix as AMBER", () => {
    expect(classifyPrincipio(new Set(["N02BA01"]), ATC_FAMILY_MAP)).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("RED takes precedence over AMBER", () => {
    expect(
      classifyPrincipio(new Set(["M01AE01", "N02BA01"]), ATC_FAMILY_MAP),
    ).toEqual({
      level: "RED",
      family: "Propiónico",
    });
  });

  it("AMBER takes precedence over GREEN", () => {
    expect(
      classifyPrincipio(new Set(["N02BA01", "N02BE01"]), ATC_FAMILY_MAP),
    ).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("uses highest-precedence family for RED when multiple RED ATC codes exist", () => {
    expect(
      classifyPrincipio(new Set(["M01AC01", "M01AE01"]), ATC_FAMILY_MAP),
    ).toEqual({
      level: "RED",
      family: "Oxicam",
    });
  });

  it("uses custom familyMap when provided", () => {
    const customMap = {
      ...ATC_FAMILY_MAP,
      M01AE: "Custom Propiónico",
    };
    expect(classifyPrincipio(new Set(["M01AE01"]), customMap)).toEqual({
      level: "RED",
      family: "Custom Propiónico",
    });
  });

  it("uses custom familyMap for new ATC subgroups", () => {
    const customMap = {
      ...ATC_FAMILY_MAP,
      M01AJ: "Nuevo AINE",
    };
    expect(classifyPrincipio(new Set(["M01AJ01"]), customMap)).toEqual({
      level: "RED",
      family: "Nuevo AINE",
    });
  });

  it("returns Otros AINE for unlisted M01A subgroups", () => {
    expect(classifyPrincipio(new Set(["M01AZ99"]), ATC_FAMILY_MAP)).toEqual({
      level: "RED",
      family: "Otros AINE",
    });
  });

  it("AMBER family is always Salicilato regardless of custom familyMap", () => {
    const customMap = {
      ...ATC_FAMILY_MAP,
      N02BA: "Aspirina derivados",
    };
    expect(classifyPrincipio(new Set(["N02BA01"]), customMap)).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("returns empty family for GREEN-level principios with AEMPS map", () => {
    expect(classifyPrincipio(new Set(["N02BE01"]), AEMPS_FAMILY_MAP)).toEqual({
      level: "GREEN",
      family: "",
    });
  });
});

describe("getAtcFamily", () => {
  it("maps M01AE to Propiónico", () => {
    expect(getAtcFamily("M01AE01", ATC_FAMILY_MAP)).toBe("Propiónico");
  });

  it("maps M01AB to Acético", () => {
    expect(getAtcFamily("M01AB01", ATC_FAMILY_MAP)).toBe("Acético");
  });

  it("returns Otros AINE for unrecognized M01A subgroups", () => {
    expect(getAtcFamily("M01AZ99", ATC_FAMILY_MAP)).toBe("Otros AINE");
  });

  it("uses custom familyMap when provided", () => {
    const customMap = {
      M01AE: "Modified Propiónico",
    };
    expect(getAtcFamily("M01AE01", customMap)).toBe("Modified Propiónico");
  });

  it("returns Otros AINE for ATC code not in custom familyMap", () => {
    const customMap = {
      M01AE: "Propiónico",
    };
    expect(getAtcFamily("M01AB01", customMap)).toBe("Otros AINE");
  });

  it("returns AEMPS-derived family names for M01A subgroups", () => {
    expect(getAtcFamily("M01AA01", AEMPS_FAMILY_MAP)).toBe(
      "Butilpirazolidinas",
    );
    expect(getAtcFamily("M01AB01", AEMPS_FAMILY_MAP)).toBe(
      "Derivados del acido acetico y sustancias relacionadas",
    );
    expect(getAtcFamily("M01AC01", AEMPS_FAMILY_MAP)).toBe("Oxicams");
    expect(getAtcFamily("M01AE01", AEMPS_FAMILY_MAP)).toBe(
      "Derivados del acido propionico",
    );
    expect(getAtcFamily("M01AG01", AEMPS_FAMILY_MAP)).toBe("Fenamatos");
    expect(getAtcFamily("M01AH01", AEMPS_FAMILY_MAP)).toBe("Coxibs");
    expect(getAtcFamily("M01AX01", AEMPS_FAMILY_MAP)).toBe(
      "Otros agentes antiinflamatorios y antirreumaticos no esteroideos",
    );
  });

  it("returns AEMPS-derived salicilato family for N02BA", () => {
    expect(getAtcFamily("N02BA01", AEMPS_FAMILY_MAP)).toBe("Salicilatos");
  });

  it("returns Otros AINE for unrecognized M01A subgroups with AEMPS map", () => {
    expect(getAtcFamily("M01AZ99", AEMPS_FAMILY_MAP)).toBe("Otros AINE");
  });

  it("matches longer prefix before shorter when order allows", () => {
    const customMap = {
      M01A: "Broad AINE",
      M01AE: "Propiónico",
    };
    expect(getAtcFamily("M01AE01", customMap)).toBe("Broad AINE");
  });
});

describe("mergeAtcCodes", () => {
  it("includes all single-principio ATC codes", () => {
    const single = new Set(["A01AB01", "M01AE01"]);
    const combo = new Set<string>();
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result).toEqual(new Set(["A01AB01", "M01AE01"]));
  });

  it("includes non-AINE combo ATC codes", () => {
    const single = new Set(["A01AB01"]);
    const combo = new Set(["C01BA01"]);
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result.has("C01BA01")).toBe(true);
  });

  it("excludes AINE-related combo ATC codes not present in single-principio", () => {
    const single = new Set(["A01AB01"]);
    const combo = new Set(["M01AE01"]);
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result.has("M01AE01")).toBe(false);
  });

  it("includes AINE-related combo ATC codes also present in single-principio", () => {
    const single = new Set(["M01AE01"]);
    const combo = new Set(["M01AE01"]);
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result.has("M01AE01")).toBe(true);
  });

  it("returns single codes when combo is empty", () => {
    const single = new Set(["M01AE01", "N02BE01"]);
    const combo = new Set<string>();
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result).toEqual(new Set(["M01AE01", "N02BE01"]));
  });

  it("handles principio with no single-principio entry in map", () => {
    const single = new Set<string>();
    const combo = new Set(["M01AE01", "C01BA01"]);
    const singleMap = new Map<number, Set<string>>();

    const result = mergeAtcCodes(single, combo, 99, singleMap);
    expect(result.has("C01BA01")).toBe(true);
    expect(result.has("M01AE01")).toBe(false);
  });

  it("merges codes from both single and combo with multiple AINE codes", () => {
    const single = new Set(["M01AE01"]);
    const combo = new Set(["M01AE01", "N02BA01", "A01AB01"]);
    const singleMap = new Map<number, Set<string>>();
    singleMap.set(1, single);

    const result = mergeAtcCodes(single, combo, 1, singleMap);
    expect(result.has("M01AE01")).toBe(true);
    expect(result.has("A01AB01")).toBe(true);
    expect(result.has("N02BA01")).toBe(false);
  });
});

describe("generateTsFile", () => {
  const classification = new Map<string, { level: Level; family: string }>([
    ["IBUPROFENO", { level: "RED", family: "Propiónico" }],
    ["PARACETAMOL", { level: "GREEN", family: "" }],
  ]);

  it("includes lastUpdated export with the provided date string in YYYY-MM-DD format", () => {
    const output = generateTsFile(classification, "2026-05-05");
    expect(output).toContain('export const lastUpdated = "2026-05-05";');
  });

  it("includes principleClassification entries sorted alphabetically", () => {
    const output = generateTsFile(classification, "2026-05-05");
    const ibuIndex = output.indexOf('"IBUPROFENO"');
    const paraIndex = output.indexOf('"PARACETAMOL"');
    expect(ibuIndex).toBeLessThan(paraIndex);
  });
});

describe("updateReadmeMarker", () => {
  it("replaces existing last-updated marker with new date", () => {
    const content =
      "Some intro\nPrincipios activos last updated: 2026-04-01 <!-- last-updated: 2026-04-01 -->\nMore text";
    const result = updateReadmeMarker(content, "2026-05-05");
    expect(result).toContain("<!-- last-updated: 2026-05-05 -->");
    expect(result).toContain("Principios activos last updated: 2026-05-05");
    expect(result).not.toContain("2026-04-01");
  });

  it("inserts marker and date when marker does not exist in README content", () => {
    const content =
      "# ¿Es un AINE?\n\nSome text\n\n| 🟡 Yellow | test |\n\n## Dev Setup";
    const result = updateReadmeMarker(content, "2026-05-05");
    expect(result).toContain("Principios activos last updated: 2026-05-05");
    expect(result).toContain("<!-- last-updated: 2026-05-05 -->");
  });

  it("adds marker to existing date line when marker is missing", () => {
    const content =
      "Principios activos last updated: 2026-04-01\n\n## Dev Setup";
    const result = updateReadmeMarker(content, "2026-05-05");
    expect(result).toContain(
      "Principios activos last updated: 2026-05-05 <!-- last-updated: 2026-05-05 -->",
    );
    expect(result).not.toContain("2026-04-01");
  });
});
