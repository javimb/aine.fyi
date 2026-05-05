import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

const onModeChange = vi.fn();

afterEach(() => {
  cleanup();
  onModeChange.mockClear();
});

describe("SearchForm", () => {
  it("renders form with aria-label='Buscar medicamento'", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={true} onModeChange={onModeChange} />,
    );
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("aria-label", "Buscar medicamento");
  });

  it("renders search input with aria-label='Nombre del medicamento'", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={true} onModeChange={onModeChange} />,
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  it("renders in hero mode when isHero is true", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={true} onModeChange={onModeChange} />,
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass("h-12");
  });

  it("renders in compact mode when isHero is false", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={false} onModeChange={onModeChange} />,
    );
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass("h-10");
  });

  it("uses shadcn Input component", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={true} onModeChange={onModeChange} />,
    );
    const input = container.querySelector('input[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it("uses shadcn Button component", async () => {
    const { default: SearchForm } = await import("./search-form");
    const { container } = render(
      <SearchForm isHero={true} onModeChange={onModeChange} />,
    );
    const button = container.querySelector('button[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });
});
