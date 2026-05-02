import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**", "dist/**", ".opencode/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        lines: 80,
        branches: 80,
      },
      exclude: [
        ".next/**",
        "next.config.*",
        "postcss.config.*",
        "eslint.config.*",
        "next-env.d.ts",
        "vitest.config.ts",
        "playwright.config.ts",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/components/**",
        "src/lib/utils.ts",
        "src/lib/test-server.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
