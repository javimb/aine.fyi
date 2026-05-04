import { describe, it, expect } from "vitest";
import {
  LevelSchema,
  PrincipleInfoSchema,
  PrincipleClassificationSchema,
} from "./aine-classification.schema";

describe("LevelSchema", () => {
  it("accepts valid level values", () => {
    expect(LevelSchema.parse("RED")).toBe("RED");
    expect(LevelSchema.parse("AMBER")).toBe("AMBER");
    expect(LevelSchema.parse("YELLOW")).toBe("YELLOW");
    expect(LevelSchema.parse("GREEN")).toBe("GREEN");
  });

  it("rejects invalid level values", () => {
    expect(() => LevelSchema.parse("BLUE")).toThrow();
    expect(() => LevelSchema.parse("red")).toThrow();
    expect(() => LevelSchema.parse("")).toThrow();
    expect(() => LevelSchema.parse(123)).toThrow();
    expect(() => LevelSchema.parse(null)).toThrow();
  });

  it("restricts to exactly 4 values", () => {
    expect(LevelSchema.options).toHaveLength(4);
  });
});

describe("PrincipleInfoSchema", () => {
  it("parses valid PrincipleInfo data", () => {
    const result = PrincipleInfoSchema.parse({
      level: "RED",
      family: "Propiónico",
    });
    expect(result).toEqual({ level: "RED", family: "Propiónico" });
  });

  it("parses GREEN with empty family", () => {
    const result = PrincipleInfoSchema.parse({ level: "GREEN", family: "" });
    expect(result).toEqual({ level: "GREEN", family: "" });
  });

  it("parses AMBER with family", () => {
    const result = PrincipleInfoSchema.parse({
      level: "AMBER",
      family: "Salicilato",
    });
    expect(result).toEqual({ level: "AMBER", family: "Salicilato" });
  });

  it("rejects data with invalid level", () => {
    expect(() =>
      PrincipleInfoSchema.parse({ level: "BLUE", family: "test" }),
    ).toThrow();
  });

  it("rejects data with missing fields", () => {
    expect(() => PrincipleInfoSchema.parse({ level: "RED" })).toThrow();
    expect(() => PrincipleInfoSchema.parse({ family: "test" })).toThrow();
    expect(() => PrincipleInfoSchema.parse({})).toThrow();
  });

  it("rejects data with wrong types", () => {
    expect(() =>
      PrincipleInfoSchema.parse({ level: 123, family: "test" }),
    ).toThrow();
    expect(() =>
      PrincipleInfoSchema.parse({ level: "RED", family: 123 }),
    ).toThrow();
  });
});

describe("PrincipleClassificationSchema", () => {
  it("parses valid classification map", () => {
    const data = {
      IBUPROFENO: { level: "RED", family: "Propiónico" },
      PARACETAMOL: { level: "GREEN", family: "" },
    };
    const result = PrincipleClassificationSchema.parse(data);
    expect(result).toEqual(data);
  });

  it("rejects classification with invalid level value", () => {
    const data = {
      IBUPROFENO: { level: "INVALID", family: "Propiónico" },
    };
    expect(() => PrincipleClassificationSchema.parse(data)).toThrow();
  });

  it("accepts empty classification map", () => {
    const result = PrincipleClassificationSchema.parse({});
    expect(result).toEqual({});
  });
});
