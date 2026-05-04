import { describe, it, expect } from "vitest";
import { matchAines } from "./aine-matcher";
import type { PrincipleClassification } from "../../data/aine-classification.schema";

const classification: PrincipleClassification = {
  IBUPROFENO: { level: "RED", family: "Propiónico" },
  DICLOFENACO: { level: "RED", family: "Acético" },
  DICLOFENACO_SODICO: { level: "RED", family: "Acético" },
  "ACETILSALICILICO ACIDO": { level: "AMBER", family: "Salicilato" },
  PARACETAMOL: { level: "GREEN", family: "" },
  PIROXICAM: { level: "RED", family: "Oxicam" },
};

describe("matchAines (4-level)", () => {
  it("returns RED when pactivos contains a RED-classified AINE", () => {
    const result = matchAines("IBUPROFENO", classification);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "IBUPROFENO", family: "Propiónico", level: "RED" },
    ]);
  });

  it("returns RED for a M01A AINE like Diclofenaco", () => {
    const result = matchAines("DICLOFENACO", classification);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "DICLOFENACO", family: "Acético", level: "RED" },
    ]);
  });

  it("returns AMBER for salicilato", () => {
    const result = matchAines("ACETILSALICILICO ACIDO", classification);
    expect(result.status).toBe("AMBER");
    expect(result.matchedAines).toEqual([
      {
        name: "ACETILSALICILICO ACIDO",
        family: "Salicilato",
        level: "AMBER",
      },
    ]);
  });

  it("RED takes precedence over AMBER when both are present", () => {
    const result = matchAines(
      "IBUPROFENO, ACETILSALICILICO ACIDO",
      classification,
    );
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "IBUPROFENO", family: "Propiónico", level: "RED" },
      {
        name: "ACETILSALICILICO ACIDO",
        family: "Salicilato",
        level: "AMBER",
      },
    ]);
  });

  it("returns YELLOW for unknown principio", () => {
    const result = matchAines("UNKNOWN_DRUG", classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns GREEN when pactivos contains only GREEN-classified principios", () => {
    const result = matchAines("PARACETAMOL", classification);
    expect(result.status).toBe("GREEN");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns RED with both matched entries when pactivos contains RED+AMBER", () => {
    const result = matchAines(
      "PIROXICAM, ACETILSALICILICO ACIDO",
      classification,
    );
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toHaveLength(2);
    expect(result.matchedAines).toContainEqual({
      name: "PIROXICAM",
      family: "Oxicam",
      level: "RED",
    });
    expect(result.matchedAines).toContainEqual({
      name: "ACETILSALICILICO ACIDO",
      family: "Salicilato",
      level: "AMBER",
    });
  });

  it("returns YELLOW when pactivos is empty string", () => {
    const result = matchAines("", classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is undefined", () => {
    const result = matchAines(undefined, classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is null", () => {
    const result = matchAines(null, classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is whitespace only", () => {
    const result = matchAines("   ", classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("uses exact key lookup, not substring matching", () => {
    const result = matchAines("IBUPROFENOX", classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("handles accents by stripping them before lookup", () => {
    const result = matchAines("IBUPROFENO, ÁCIDO ASCÓRBICO", classification);
    expect(result.status).toBe("RED");
  });

  it("handles mixed-case pactivos by uppercasing", () => {
    const result = matchAines("ibuprofeno, Paracetamol", classification);
    expect(result.status).toBe("RED");
  });

  it("UNKNOWN alongside RED shows RED and only RED in matchedAines", () => {
    const result = matchAines("IBUPROFENO, UNKNOWN_DRUG", classification);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "IBUPROFENO", family: "Propiónico", level: "RED" },
    ]);
  });

  it("UNKNOWN alongside GREEN upgrades status to YELLOW", () => {
    const result = matchAines("UNKNOWN_DRUG, PARACETAMOL", classification);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });
});
