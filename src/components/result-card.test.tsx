import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import type { SearchResult } from "./search-bar";

afterEach(cleanup);

const messages = {
  status: {
    activeIngredientsLabel: "Principios activos",
    RED: {
      banner: "AINE DETECTADO",
      message:
        "Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico.",
      ariaLabel: "AINE detectado",
    },
    AMBER: {
      banner: "SALICILATO DETECTADO",
      message:
        "Los salicilatos pueden provocar reacción cruzada con alergia a AINE. Consulta con tu farmacéutico.",
      ariaLabel: "Salicilato detectado",
    },
    GREEN: {
      banner: "LIBRE DE AINE",
      message: "No se han detectado compuestos AINE.",
      ariaLabel: "Libre de AINE",
    },
    YELLOW: {
      banner: "NO PUDIMOS VERIFICAR",
      message:
        "No pudimos verificar los componentes de este medicamento. Consulta con tu farmacéutico.",
      ariaLabel: "No pudimos verificar",
    },
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const makeResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  nombre: "Ibuprofeno 400mg",
  pactivos: "ibuprofeno",
  aineAnalysis: {
    status: "RED",
    matchedAines: [
      { name: "IBUPROFENO", family: "Arylpropionicos", level: "RED" },
    ],
  },
  ...overrides,
});

describe("ResultCard", () => {
  it("renders RED card with status banner, bg, compound pills, and warning", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result = makeResult();
    const { container, getByText } = renderWithProvider(
      <ResultCard result={result} />,
    );
    expect(getByText("AINE DETECTADO")).toBeInTheDocument();
    expect(
      getByText(
        "Evita este medicamento si tienes alergia a AINE. Consulta con tu farmacéutico.",
      ),
    ).toBeInTheDocument();
    const card = container.querySelector("[role='article']");
    expect(card?.className).toContain("bg-status-red-bg");
  });

  it("renders RED card with WarningIcon before message text in flex container with gap-1", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result = makeResult();
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const warningIcon = container.querySelector("[aria-hidden='true']");
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon?.textContent).toBe("⚠️");
    const flexContainer = warningIcon?.closest(".flex");
    expect(flexContainer?.className).toContain("gap-1");
  });

  it("renders AMBER card with salicilato banner and WarningIcon", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Aspirina 500mg",
      pactivos: "ácido acetilsalicílico",
      aineAnalysis: {
        status: "AMBER",
        matchedAines: [
          {
            name: "ACIDO ACETILSALICILICO",
            family: "Salicilato",
            level: "AMBER",
          },
        ],
      },
    };
    const { container, getByText } = renderWithProvider(
      <ResultCard result={result} />,
    );
    expect(getByText("SALICILATO DETECTADO")).toBeInTheDocument();
    const warningIcon = container.querySelector("[aria-hidden='true']");
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon?.textContent).toBe("⚠️");
  });

  it("renders GREEN card with libre de AINE banner, safe message, and neutral pills", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Paracetamol 650mg",
      pactivos: "paracetamol",
      aineAnalysis: { status: "GREEN", matchedAines: [] },
    };
    const { container, getByText } = renderWithProvider(
      <ResultCard result={result} />,
    );
    expect(getByText("LIBRE DE AINE")).toBeInTheDocument();
    expect(
      getByText("No se han detectado compuestos AINE."),
    ).toBeInTheDocument();
    const pillsList = container.querySelector("[role='list']");
    expect(pillsList).toHaveAttribute("aria-label", "Principios activos");
  });

  it("renders GREEN card without WarningIcon", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Paracetamol 650mg",
      pactivos: "paracetamol",
      aineAnalysis: { status: "GREEN", matchedAines: [] },
    };
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const warningIcons = container.querySelectorAll("[aria-hidden='true']");
    expect(warningIcons).toHaveLength(0);
  });

  it("renders YELLOW card with unverifiable banner, neutral pills, and WarningIcon", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Desconocido",
      pactivos: "unknown",
      aineAnalysis: { status: "YELLOW", matchedAines: [] },
    };
    const { container, getByText } = renderWithProvider(
      <ResultCard result={result} />,
    );
    expect(getByText("NO PUDIMOS VERIFICAR")).toBeInTheDocument();
    const warningIcon = container.querySelector("[aria-hidden='true']");
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon?.textContent).toBe("⚠️");
    const pillsList = container.querySelector("[role='list']");
    expect(pillsList).toHaveAttribute("aria-label", "Principios activos");
  });

  it("has role=article with aria-label including medication name and status", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result = makeResult();
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const card = container.querySelector("[role='article']");
    expect(card).toHaveAttribute("aria-label");
    expect(card?.getAttribute("aria-label")).toContain("Ibuprofeno 400mg");
  });

  it("pills section has aria-label='Principios activos' for all results", async () => {
    const { default: ResultCard } = await import("./result-card");
    const redResult = makeResult();
    const { container } = renderWithProvider(<ResultCard result={redResult} />);
    const pillsList = container.querySelector("[role='list']");
    expect(pillsList).toHaveAttribute("aria-label", "Principios activos");
  });

  it("renders all tokens from pactivos as pills", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Combo",
      pactivos: "IBUPROFENO, PARACETAMOL",
      aineAnalysis: {
        status: "RED",
        matchedAines: [
          { name: "IBUPROFENO", family: "Arylpropionicos", level: "RED" },
        ],
      },
    };
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const pills = container.querySelectorAll("[role='listitem']");
    expect(pills.length).toBe(2);
  });

  it("correlates tokens with matchedAines and renders RED/AMBER pills correctly", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Combo",
      pactivos: "IBUPROFENO, PARACETAMOL",
      aineAnalysis: {
        status: "RED",
        matchedAines: [
          { name: "IBUPROFENO", family: "Arylpropionicos", level: "RED" },
        ],
      },
    };
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const pills = container.querySelectorAll("[role='listitem']");
    expect(pills[0]?.className).toContain("bg-status-red-bg");
    expect(pills[1]?.className).toContain("bg-muted");
  });

  it("renders unmatched tokens as NEUTRAL pills", async () => {
    const { default: ResultCard } = await import("./result-card");
    const result: SearchResult = {
      nombre: "Desconocido",
      pactivos: "UNKNOWN_COMPOUND",
      aineAnalysis: { status: "YELLOW", matchedAines: [] },
    };
    const { container } = renderWithProvider(<ResultCard result={result} />);
    const pills = container.querySelectorAll("[role='listitem']");
    expect(pills.length).toBe(1);
    expect(pills[0]?.className).toContain("bg-muted");
  });
});
