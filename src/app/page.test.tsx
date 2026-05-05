import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

vi.mock("@/components/search-form", () => ({
  default: () => <div data-testid="search-form">Search Form</div>,
}));

vi.mock("../../data/aine-classification", () => ({
  principioClassification: {},
  lastUpdated: "2026-05-05",
}));

describe("Home page", () => {
  it("displays AEMPS attribution with lastUpdated date", async () => {
    const { default: Home } = await import("./page");
    const { getByText } = render(<Home />);
    expect(getByText(/Datos: AEMPS \(CIMA\)/)).toBeInTheDocument();
    expect(getByText(/Actualizado: 2026-05-05/)).toBeInTheDocument();
  });

  it("displays the page title", async () => {
    const { default: Home } = await import("./page");
    const { getByRole } = render(<Home />);
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "¿Es un AINE?",
    );
  });

  it("displays the AINE explainer section", async () => {
    const { default: Home } = await import("./page");
    const { getByText } = render(<Home />);
    expect(getByText("¿Qué son los AINE?")).toBeInTheDocument();
  });

  it("displays the medical disclaimer", async () => {
    const { default: Home } = await import("./page");
    const { getByText } = render(<Home />);
    expect(getByText(/Aviso importante/)).toBeInTheDocument();
    expect(
      getByText(/no sustituye el consejo médico profesional/),
    ).toBeInTheDocument();
  });
});
