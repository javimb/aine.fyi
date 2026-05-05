import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import type { SearchResult } from "./search-bar";

afterEach(cleanup);

const makeResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  nombre: "Ibuprofeno 400mg",
  pactivos: "ibuprofeno",
  aineAnalysis: {
    status: "RED",
    matchedAines: [
      { name: "Ibuprofeno", family: "Arylpropionicos", level: "RED" },
    ],
  },
  ...overrides,
});

describe("ResultCard", () => {
  it("renders RED card with status banner, border, bg, compound pills, and warning", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result = makeResult();
    const { container, getByText } = render(<ResultCard result={result} />);
    expect(getByText("🔴 AINE DETECTADO")).toBeInTheDocument();
    expect(
      getByText(
        "⚠️ Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico.",
      ),
    ).toBeInTheDocument();
    const card = container.querySelector("[role='article']");
    expect(card?.className).toContain("border-l-status-red-border");
    expect(card?.className).toContain("bg-status-red-bg");
  });

  it("renders AMBER card with salicilato banner", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Aspirina 500mg",
      pactivos: "ácido acetilsalicílico",
      aineAnalysis: {
        status: "AMBER",
        matchedAines: [
          {
            name: "Ácido Acetilsalicílico",
            family: "Salicilato",
            level: "AMBER",
          },
        ],
      },
    };
    const { container, getByText } = render(<ResultCard result={result} />);
    expect(getByText("🟠 SALICILATO DETECTADO")).toBeInTheDocument();
    const card = container.querySelector("[role='article']");
    expect(card?.className).toContain("border-l-status-amber-border");
    expect(card?.className).toContain("bg-status-amber-bg");
  });

  it("renders GREEN card with libre de AINE banner, safe message, no pills", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Paracetamol 650mg",
      pactivos: "paracetamol",
      aineAnalysis: { status: "GREEN", matchedAines: [] },
    };
    const { container, getByText } = render(<ResultCard result={result} />);
    expect(getByText("🟢 LIBRE DE AINE")).toBeInTheDocument();
    expect(
      getByText("No se han detectado compuestos AINE."),
    ).toBeInTheDocument();
    const card = container.querySelector("[role='article']");
    expect(card?.className).toContain("border-l-status-green-border");
    expect(card?.className).toContain("bg-status-green-bg");
    expect(
      container.querySelector("[role='listitem']"),
    ).not.toBeInTheDocument();
  });

  it("renders YELLOW card with unverifiable banner and warning", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Desconocido",
      pactivos: "unknown",
      aineAnalysis: { status: "YELLOW", matchedAines: [] },
    };
    const { container, getByText } = render(<ResultCard result={result} />);
    expect(getByText("🟡 NO PUDIMOS VERIFICAR")).toBeInTheDocument();
    const card = container.querySelector("[role='article']");
    expect(card?.className).toContain("border-l-status-yellow-border");
    expect(card?.className).toContain("bg-status-yellow-bg");
  });

  it("has role=article with aria-label including medication name and status", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result = makeResult();
    const { container } = render(<ResultCard result={result} />);
    const card = container.querySelector("[role='article']");
    expect(card).toHaveAttribute("aria-label");
    expect(card?.getAttribute("aria-label")).toContain("Ibuprofeno 400mg");
  });
});
