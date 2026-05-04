import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

describe("RootLayout Analytics", () => {
  it("should include Analytics component from @vercel/analytics/react", () => {
    const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
    const layoutContent = readFileSync(layoutPath, "utf-8");

    const hasAnalyticsImport = layoutContent.includes(
      'import { Analytics } from "@vercel/analytics/react"',
    );
    expect(hasAnalyticsImport).toBe(true);
  });

  it("should render Analytics component inside body after children", () => {
    const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
    const layoutContent = readFileSync(layoutPath, "utf-8");

    const hasAnalyticsUsage =
      layoutContent.includes("<Analytics") ||
      layoutContent.includes("</Analytics>");
    expect(hasAnalyticsUsage).toBe(true);
  });
});
