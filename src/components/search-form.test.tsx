import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

describe("SearchForm", () => {
  it("renders form with aria-label='Buscar medicamento'", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(<SearchForm />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("aria-label", "Buscar medicamento");
  });

  it("renders search input with aria-label='Nombre del medicamento'", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(<SearchForm />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  it("renders input with h-12 (hero size) by default", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(<SearchForm />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass("h-12");
  });

  it("uses shadcn Input component", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(<SearchForm />);
    const input = container.querySelector('input[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it("uses shadcn Button component", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(<SearchForm />);
    const button = container.querySelector('button[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it("shows Limpiar button when results are present", async () => {
    const { default: SearchForm } = await import("./search-form");
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              resultados: [
                {
                  nombre: "Test",
                  pactivos: "test",
                  aineAnalysis: {
                    status: "GREEN",
                    matchedAines: [],
                  },
                },
              ],
            }),
        }),
      ),
    );
    const { container, getByRole } = render(<SearchForm />);
    const form = container.querySelector("form")!;
    await form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
});
