import { describe, it, expect } from "vitest";
import { validateBarcodeEAN13 } from "./validate-barcode";

describe("validateBarcodeEAN13", () => {
  it("returns true for a valid EAN-13 code", () => {
    expect(validateBarcodeEAN13("8470006543214")).toBe(true);
  });

  it("returns true for another valid EAN-13 code", () => {
    expect(validateBarcodeEAN13("5901234123457")).toBe(true);
  });

  it("returns false when the check digit does not match", () => {
    expect(validateBarcodeEAN13("8470006543219")).toBe(false);
  });

  it("returns false for a code shorter than 13 digits", () => {
    expect(validateBarcodeEAN13("12345")).toBe(false);
  });

  it("returns false for a code with non-numeric characters", () => {
    expect(validateBarcodeEAN13("123456789012A")).toBe(false);
  });

  it("returns false when two adjacent digits are transposed", () => {
    expect(validateBarcodeEAN13("8470006453214")).toBe(false);
  });
});
