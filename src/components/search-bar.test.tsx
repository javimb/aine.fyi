import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
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
  results: {
    count: "{count, plural, one {# resultado} other {# resultados}}",
  },
  emptyState: {
    title: 'No encontramos "{query}"',
    tipHeading: "Sugerencias",
    tipSpelling: "Revisa la ortografía del nombre",
    tipGeneric: "Prueba con el nombre genérico (principio activo)",
    tipBrand: "Prueba con el nombre comercial del medicamento",
  },
  errorState: {
    title: "Error al consultar",
    retry: "Reintentar",
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

describe("SearchBar state transitions", () => {
  const originalFetch = globalThis.fetch;
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollIntoViewSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewSpy;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  async function setupSearchBar() {
    const { default: SearchBar } = await import("./search-bar");
    const result = renderWithProvider(<SearchBar />);
    const input = result.container.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    const form = result.container.querySelector("form") as HTMLFormElement;
    return { ...result, input, form };
  }

  it("renders EmptyState when API returns empty resultados", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    });

    const { input, form } = await setupSearchBar();
    fireEvent.change(input, { target: { value: "xyznoexiste" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(
      screen.getByText('No encontramos "xyznoexiste"'),
    ).toBeInTheDocument();
  });

  it("renders ErrorState on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { input, form } = await setupSearchBar();
    fireEvent.change(input, { target: { value: "ibuprofeno" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText("Error al buscar")).toBeInTheDocument();
  });

  it("renders ErrorState on API error response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: "Service unavailable" }),
    });

    const { input, form } = await setupSearchBar();
    fireEvent.change(input, { target: { value: "aspirina" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
  });

  it("retry button re-submits the search", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Ibuprofeno",
                pactivos: "ibuprofeno",
                aineAnalysis: { status: "GREEN" },
              },
            ],
          }),
      });

    globalThis.fetch = mockFetch;

    const { input, form } = await setupSearchBar();
    fireEvent.change(input, { target: { value: "ibuprofeno" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("scrolls into view on empty and error states", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    });

    const { input, form } = await setupSearchBar();
    fireEvent.change(input, { target: { value: "xyznoexiste" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });

    scrollIntoViewSpy.mockClear();

    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { input: input2, form: form2 } = await setupSearchBar();
    fireEvent.change(input2, { target: { value: "asdf" } });
    fireEvent.submit(form2);

    await waitFor(() => {
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });
  });
});
