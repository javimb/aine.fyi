import { describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

afterEach(cleanup);

const messages = {
  search: {
    formLabel: "Buscar medicamento",
    inputLabel: "Nombre del medicamento",
    placeholder: "Buscar medicamento...",
    button: "Buscar",
    buttonLoading: "Buscando...",
    error: "Error al buscar",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("SearchBar", () => {
  it("renders form with aria-label from translations", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = renderWithProvider(<SearchBar />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("aria-label", "Buscar medicamento");
  });

  it("renders search input with aria-label from translations", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute("aria-label", "Nombre del medicamento");
  });

  it("renders input with h-12 (hero size) by default", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveClass("h-12");
  });

  it("uses shadcn Input component", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it("uses shadcn Button component", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container } = renderWithProvider(<SearchBar />);
    const button = container.querySelector('button[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it("renders search button with translated text", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { getByRole } = renderWithProvider(<SearchBar />);
    const button = getByRole("button", { name: /buscar/i });
    expect(button).toBeInTheDocument();
  });
});
