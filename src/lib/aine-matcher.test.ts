import { describe, it, expect } from "vitest";
import { matchAines } from "./aine-matcher";
import type { AineBlacklist } from "../../data/aines.schema";

const blacklist: AineBlacklist = [
  {
    name: "Ibuprofeno",
    cimaNames: ["IBUPROFENO"],
    aliases: ["Advil"],
    family: "Profeno",
  },
  {
    name: "Ácido Acetilsalicílico",
    cimaNames: ["ACETILSALICILICO ACIDO"],
    aliases: ["Aspirina"],
    family: "Salicilato",
  },
  {
    name: "Diclofenaco",
    cimaNames: ["DICLOFENACO", "DICLOFENACO SODICO"],
    aliases: ["Voltaren"],
    family: "Acético",
  },
];

describe("matchAines", () => {
  it("returns RED when pactivos contains a known AINE", () => {
    const result = matchAines("IBUPROFENO", blacklist);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "Ibuprofeno", family: "Profeno" },
    ]);
  });

  it("returns RED with multiple matched AINEs", () => {
    const result = matchAines("IBUPROFENO, ACETILSALICILICO ACIDO", blacklist);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "Ibuprofeno", family: "Profeno" },
      { name: "Ácido Acetilsalicílico", family: "Salicilato" },
    ]);
  });

  it("matches cimaNames with salt variants", () => {
    const result = matchAines("DICLOFENACO SODICO", blacklist);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "Diclofenaco", family: "Acético" },
    ]);
  });

  it("returns GREEN when pactivos has no AINE matches", () => {
    const result = matchAines("PARACETAMOL", blacklist);
    expect(result.status).toBe("GREEN");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is empty string", () => {
    const result = matchAines("", blacklist);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is undefined", () => {
    const result = matchAines(undefined, blacklist);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is null", () => {
    const result = matchAines(null, blacklist);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("returns YELLOW when pactivos is whitespace only", () => {
    const result = matchAines("   ", blacklist);
    expect(result.status).toBe("YELLOW");
    expect(result.matchedAines).toEqual([]);
  });

  it("handles pactivos with accents by stripping them", () => {
    const result = matchAines("IBUPROFENO, ÁCIDO ASCÓRBICO", blacklist);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "Ibuprofeno", family: "Profeno" },
    ]);
  });

  it("handles mixed-case pactivos by uppercasing", () => {
    const result = matchAines("ibuprofeno, Paracetamol", blacklist);
    expect(result.status).toBe("RED");
    expect(result.matchedAines).toEqual([
      { name: "Ibuprofeno", family: "Profeno" },
    ]);
  });
});
