import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(cleanup);

describe("SearchBar", () => {
  it("renders form with aria-label='Buscar medicamento'", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = render(<SearchBar />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("aria-label", "Buscar medicamento");
  });

  it("renders search input with aria-label='Nombre del medicamento'", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = render(<SearchBar />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  it("renders input with h-12 (hero size) by default", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = render(<SearchBar />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass("h-12");
  });

  it("uses shadcn Input component", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = render(<SearchBar />);
    const input = container.querySelector('input[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it("uses shadcn Button component", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = render(<SearchBar />);
    const button = container.querySelector('button[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it("renders search button with Buscar text", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { getByRole } = render(<SearchBar />);
    const button = getByRole("button", { name: /buscar/i });
    expect(button).toBeInTheDocument();
  });
});
