import { describe, it, expect } from "vitest";
import {
  classifyPrincipio,
  getAtcFamily,
  mergeAtcCodes,
} from "./classify-utils";

describe("classifyPrincipio", () => {
  it("returns YELLOW for undefined ATC codes", () => {
    expect(classifyPrincipio(undefined)).toEqual({
      level: "YELLOW",
      family: "",
    });
  });

  it("returns YELLOW for empty ATC code set", () => {
    expect(classifyPrincipio(new Set())).toEqual({
      level: "YELLOW",
      family: "",
    });
  });

  it("returns GREEN for non-AINE ATC codes", () => {
    expect(classifyPrincipio(new Set(["N02BE01"]))).toEqual({
      level: "GREEN",
      family: "",
    });
  });

  it("classifies M01A ATC codes as RED", () => {
    expect(classifyPrincipio(new Set(["M01AE01"]))).toEqual({
      level: "RED",
      family: "Propiónico",
    });
  });

  it("classifies B01AC06 as AMBER", () => {
    expect(classifyPrincipio(new Set(["B01AC06"]))).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("classifies N02BA prefix as AMBER", () => {
    expect(classifyPrincipio(new Set(["N02BA01"]))).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("RED takes precedence over AMBER", () => {
    expect(classifyPrincipio(new Set(["M01AE01", "N02BA01"]))).toEqual({
      level: "RED",
      family: "Propiónico",
    });
  });

  it("AMBER takes precedence over GREEN", () => {
    expect(classifyPrincipio(new Set(["N02BA01", "N02BE01"]))).toEqual({
      level: "AMBER",
      family: "Salicilato",
    });
  });

  it("uses highest-precedence family for RED when multiple RED ATC codes exist", () => {
    expect(classifyPrincipio(new Set(["M01AC01", "M01AE01"]))).toEqual({
      level: "RED",
      family: "Oxicam",
    });
  });
});

describe("getAtcFamily", () => {
  it("maps M01AE to Propiónico", () => {
    expect(getAtcFamily("M01AE01")).toBe("Propiónico");
  });

  it("maps M01AB to Acético", () => {
    expect(getAtcFamily("M01AB01")).toBe("Acético");
  });

  it("returns Otros AINE for unrecognized M01A subgroups", () => {
    expect(getAtcFamily("M01AZ99")).toBe("Otros AINE");
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
});
