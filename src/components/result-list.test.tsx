import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import type { SearchResult } from "./search-bar";

afterEach(cleanup);

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
    const { getByText, container } = render(<ResultList results={results} />);
    expect(getByText("3 resultados")).toBeInTheDocument();
    const cards = container.querySelectorAll("[role='article']");
    expect(cards).toHaveLength(3);
  });

  it("displays singular count for 1 result", async () => {
    const { default: ResultList } = await import("./result-list");
    const results = makeResults(1, "GREEN");
    const { getByText } = render(<ResultList results={results} />);
    expect(getByText("1 resultado")).toBeInTheDocument();
  });
});
