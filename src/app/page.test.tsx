import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("../../data/aine-classification", () => ({
  principioClassification: {},
  lastUpdated: "2026-05-05",
}));

const allMessages: Record<string, Record<string, string>> = {
  app: {
    title: "¿Es un AINE?",
    description: "Comprueba si un medicamento contiene algún AINE",
  },
  explainer: {
    heading: "¿Qué son los AINE?",
    body: "Los AINE (antiinflamatorios no esteroideos)...",
  },
  disclaimer: {
    heading: "⚠️ Aviso importante",
    body: "Esta herramienta es informativa...",
  },
  dataSource: {
    attribution: "Datos: AEMPS (CIMA) · Actualizado: 2026-05-05",
  },
};

vi.mock("next-intl/server", () => ({
  getTranslations: (namespace: string) => {
    const ns = allMessages[namespace] ?? {};
    return Promise.resolve((key: string, vars?: Record<string, unknown>) => {
      let result = ns[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          result = result.replace(`{${k}}`, String(v));
        }
      }
      return result;
    });
  },
}));

vi.mock("@/components/aine-explainer", () => ({
  default: () => (
    <section>
      <h2>¿Qué son los AINE?</h2>
    </section>
  ),
}));

vi.mock("@/components/disclaimer", () => ({
  default: () => (
    <div role="note">
      <p>⚠️ Aviso importante</p>
      <p>Esta herramienta es informativa...</p>
    </div>
  ),
}));

vi.mock("@/components/data-source", () => ({
  default: () => <p>Datos: AEMPS (CIMA) · Actualizado: 2026-05-05</p>,
}));

vi.mock("@/components/search-bar", () => ({
  default: () => (
    <form aria-label="Buscar medicamento">
      <input />
    </form>
  ),
}));

describe("Home page", () => {
  it("displays the page title", async () => {
    const { default: Home } = await import("./page");
    const { getByRole } = render(await Home());
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "¿Es un AINE?",
    );
  });

  it("displays the page description", async () => {
    const { default: Home } = await import("./page");
    const { getByText } = render(await Home());
    expect(
      getByText("Comprueba si un medicamento contiene algún AINE"),
    ).toBeInTheDocument();
  });

  it("renders hero layout with min-h-dvh and justify-center", async () => {
    const { default: Home } = await import("./page");
    const { container } = render(await Home());
    const main = container.querySelector("main");
    expect(main?.className).toContain("min-h-dvh");
    expect(main?.className).toContain("justify-center");
  });

  it("renders all sections within max-w-2xl containers", async () => {
    const { default: Home } = await import("./page");
    const { container } = render(await Home());
    const maxWidthElements = container.querySelectorAll(".max-w-2xl");
    expect(maxWidthElements.length).toBeGreaterThanOrEqual(2);
  });
});
