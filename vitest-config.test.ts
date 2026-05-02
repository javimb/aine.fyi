import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("vitest.config.ts regression guards", () => {
  const configPath = resolve(__dirname, "vitest.config.ts");
  const configContent = readFileSync(configPath, "utf-8");

  it("does not contain passWithNoTests option", () => {
    expect(configContent).not.toContain("passWithNoTests");
  });

  it("contains coverage configuration", () => {
    expect(configContent).toContain("coverage");
    expect(configContent).toContain("thresholds");
  });
});
