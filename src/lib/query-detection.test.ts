import { describe, it, expect } from "vitest";
import { detectQueryType, extractCnFromEan13 } from "./query-detection";

describe("detectQueryType", () => {
  it("classifies 6-digit numeric input as 'cn'", () => {
    expect(detectQueryType("123456")).toBe("cn");
  });

  it("classifies 7-digit numeric input as 'cn'", () => {
    expect(detectQueryType("1234567")).toBe("cn");
  });

  it("classifies 13-digit numeric input as 'ean13'", () => {
    expect(detectQueryType("8470001234567")).toBe("ean13");
  });

  it("classifies alphanumeric input as 'name'", () => {
    expect(detectQueryType("ibuprofeno")).toBe("name");
  });

  it("classifies short numeric input (< 6 digits) as 'name'", () => {
    expect(detectQueryType("12345")).toBe("name");
  });

  it("classifies 8-12 digit numeric input as 'name'", () => {
    expect(detectQueryType("12345678")).toBe("name");
  });

  it("trims whitespace before classification", () => {
    expect(detectQueryType("  123456  ")).toBe("cn");
  });
});

describe("extractCnFromEan13", () => {
  it("extracts CN substring from valid EAN-13", () => {
    expect(extractCnFromEan13("8470001234567")).toBe("123456");
  });

  it("returns null for string shorter than 13 characters", () => {
    expect(extractCnFromEan13("123456789012")).toBeNull();
  });

  it("returns null for string longer than 13 characters", () => {
    expect(extractCnFromEan13("12345678901234")).toBeNull();
  });

  it("extracts exactly indices 6-12 from a 13-character string", () => {
    expect(extractCnFromEan13("ABCDEFGHIJKLM")).toBe("GHIJKL");
  });

  it("returns null for empty string", () => {
    expect(extractCnFromEan13("")).toBeNull();
  });
});
