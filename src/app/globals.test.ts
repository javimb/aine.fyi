import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const css = readFileSync(resolve(__dirname, "globals.css"), "utf-8");

describe("globals.css status color tokens", () => {
  const statusTokens = [
    "--status-red",
    "--status-red-bg",
    "--status-red-border",
    "--status-amber",
    "--status-amber-bg",
    "--status-amber-border",
    "--status-green",
    "--status-green-bg",
    "--status-green-border",
    "--status-yellow",
    "--status-yellow-bg",
    "--status-yellow-border",
  ];

  for (const token of statusTokens) {
    it(`defines ${token} in :root`, () => {
      expect(css).toContain(`${token}:`);
    });
  }

  it("defines --primary as oklch(0.35 0.07 255)", () => {
    expect(css).toContain("--primary: oklch(0.35 0.07 255)");
  });

  it("defines --background as oklch(0.99 0.002 255)", () => {
    expect(css).toContain("--background: oklch(0.99 0.002 255)");
  });
});

describe("globals.css @theme inline status color mappings", () => {
  const mappings = [
    "--color-status-red",
    "--color-status-red-bg",
    "--color-status-red-border",
    "--color-status-amber",
    "--color-status-amber-bg",
    "--color-status-amber-border",
    "--color-status-green",
    "--color-status-green-bg",
    "--color-status-green-border",
    "--color-status-yellow",
    "--color-status-yellow-bg",
    "--color-status-yellow-border",
  ];

  for (const mapping of mappings) {
    it(`maps ${mapping} to CSS variable`, () => {
      expect(css).toContain(mapping);
    });
  }
});
