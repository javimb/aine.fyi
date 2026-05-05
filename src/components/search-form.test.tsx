import { describe, it, expect } from "vitest";
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
});
