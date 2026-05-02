import { describe, it, expect } from "vitest";
import { validatedAines } from "./aines";
import { aineBlacklistSchema } from "./aines.schema";

describe("validatedAines", () => {
  it("parses successfully through Zod schema", () => {
    expect(() => aineBlacklistSchema.parse(validatedAines)).not.toThrow();
  });

  it("contains exactly 7 entries", () => {
    expect(validatedAines).toHaveLength(7);
  });

  it("has all required fields filled for every entry", () => {
    for (const entry of validatedAines) {
      expect(entry.name).toBeTruthy();
      expect(entry.cimaNames).toBeInstanceOf(Array);
      expect(entry.cimaNames.length).toBeGreaterThan(0);
      expect(entry.aliases).toBeInstanceOf(Array);
      expect(entry.aliases.length).toBeGreaterThan(0);
      expect(entry.family).toBeTruthy();
    }
  });

  it("includes all expected AINE medications", () => {
    const names = validatedAines.map((a) => a.name);
    expect(names).toContain("Ibuprofeno");
    expect(names).toContain("Ácido Acetilsalicílico");
    expect(names).toContain("Naproxeno");
    expect(names).toContain("Diclofenaco");
    expect(names).toContain("Dexketoprofeno");
    expect(names).toContain("Indometacina");
    expect(names).toContain("Piroxicam");
  });

  it("has non-empty cimaNames for every entry", () => {
    for (const entry of validatedAines) {
      expect(entry.cimaNames.length).toBeGreaterThanOrEqual(1);
      for (const cimaName of entry.cimaNames) {
        expect(cimaName).toBeTruthy();
      }
    }
  });

  it("has non-empty aliases for every entry", () => {
    for (const entry of validatedAines) {
      expect(entry.aliases.length).toBeGreaterThanOrEqual(1);
      for (const alias of entry.aliases) {
        expect(alias).toBeTruthy();
      }
    }
  });
});
