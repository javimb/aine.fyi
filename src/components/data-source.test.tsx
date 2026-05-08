import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("../../data/aine-classification", () => ({
  principioClassification: {},
  lastUpdated: "2026-05-05",
}));

const dataSourceMessages = {
  attribution: "Datos: AEMPS (CIMA) · Actualizado: {date}",
};

vi.mock("next-intl/server", () => ({
  getTranslations: () =>
    Promise.resolve((key: string, vars?: Record<string, unknown>) => {
      let result =
        dataSourceMessages[key as keyof typeof dataSourceMessages] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          result = result.replace(`{${k}}`, String(v));
        }
      }
      return result;
    }),
}));

describe("DataSource", () => {
  it("renders the lastUpdated date", async () => {
    const { default: DataSource } = await import("./data-source");
    const { getByText } = render(await DataSource());
    expect(getByText(/Actualizado: 2026-05-05/)).toBeInTheDocument();
  });

  it("renders AEMPS attribution text", async () => {
    const { default: DataSource } = await import("./data-source");
    const { getByText } = render(await DataSource());
    expect(getByText(/Datos: AEMPS \(CIMA\)/)).toBeInTheDocument();
  });
});
