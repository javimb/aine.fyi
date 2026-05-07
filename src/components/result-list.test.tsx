import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import type { SearchResult } from "./search-bar";

afterEach(cleanup);

const messages = {
  results: {
    count: "{count, plural, one {# resultado} other {# resultados}}",
  },
  status: {
    activeIngredientsLabel: "Principios activos",
    RED: {
      banner: "🔴 AINE DETECTADO",
      message: "msg",
      ariaLabel: "AINE detectado",
    },
    AMBER: {
      banner: "🟠 SALICILATO DETECTADO",
      message: "msg",
      ariaLabel: "Salicilato detectado",
    },
    GREEN: {
      banner: "🟢 LIBRE DE AINE",
      message: "msg",
      ariaLabel: "Libre de AINE",
    },
    YELLOW: {
      banner: "🟡 NO PUDIMOS VERIFICAR",
      message: "msg",
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

const makeResults = (
  count: number,
  status: SearchResult["aineAnalysis"]["status"] = "RED",
): SearchResult[] =>
  Array.from({ length: count }, (_, i) => ({
    nombre: `Medication ${i + 1}`,
    pactivos: "active ingredient",
    aineAnalysis: { status, matchedAines: [] },
  }));

describe("ResultList", () => {
  it("renders N cards for N results and displays plural count", async () => {
    const { default: ResultList } = await import("./result-list");
    const results = makeResults(3, "GREEN");
    const { getByText, container } = renderWithProvider(
      <ResultList results={results} />,
    );
    expect(getByText("3 resultados")).toBeInTheDocument();
    const cards = container.querySelectorAll("[role='article']");
    expect(cards).toHaveLength(3);
  });

  it("displays singular count for 1 result", async () => {
    const { default: ResultList } = await import("./result-list");
    const results = makeResults(1, "GREEN");
    const { getByText } = renderWithProvider(<ResultList results={results} />);
    expect(getByText("1 resultado")).toBeInTheDocument();
  });
});
