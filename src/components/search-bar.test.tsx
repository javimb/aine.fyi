import { describe, it, expect, vi } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";

Element.prototype.scrollIntoView = vi.fn();

afterEach(cleanup);

const messages = {
  search: {
    formLabel: "Buscar medicamento",
    inputLabel: "Nombre del medicamento",
    placeholder: "Buscar medicamento...",
    button: "Buscar",
    buttonLoading: "Buscando...",
    error: "Error al buscar",
    emptyResults:
      "No se han encontrado medicamentos con ese nombre. Comprueba que está bien escrito.",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

async function fill(input: Element, value: string) {
  const user = userEvent.setup();
  await user.click(input);
  await user.keyboard(value);
}

async function submit(form: Element) {
  const user = userEvent.setup();
  await userEvent.click(form.querySelector('button[type="submit"]')!);
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

  it("renders EmptyResults when API returns empty resultados array", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container, getByRole } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[type="text"]')!;
    const form = container.querySelector("form")!;

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    });

    await fill(input, "xyz");
    await submit(form);

    const status = getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status.textContent).toContain("No se han encontrado medicamentos");
  });

  it("does not render EmptyResults when results are found", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container, queryByRole } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[type="text"]')!;
    const form = container.querySelector("form")!;

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          resultados: [
            {
              nombre: "Ibuprofeno",
              pactivos: "IBUPROFENO",
              aineAnalysis: { status: "RED", matchedAines: [] },
            },
          ],
        }),
    });

    await fill(input, "ibuprofeno");
    await submit(form);

    expect(queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not render EmptyResults when error occurs", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container, queryByRole, getByRole } = renderWithProvider(
      <SearchBar />,
    );
    const input = container.querySelector('input[type="text"]')!;
    const form = container.querySelector("form")!;

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ error: "Error al consultar la API de CIMA" }),
    });

    await fill(input, "xyz");
    await submit(form);

    expect(queryByRole("status")).not.toBeInTheDocument();
    expect(getByRole("alert")).toBeInTheDocument();
  });

  it("hides EmptyResults during loading", async () => {
    const { default: SearchBar } = await import("./search-bar");
    const { container, queryByRole } = renderWithProvider(<SearchBar />);
    const input = container.querySelector('input[type="text"]')!;
    const form = container.querySelector("form")!;

    let resolvePromise: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(pendingPromise);

    await fill(input, "xyz");
    await submit(form);

    expect(queryByRole("status")).not.toBeInTheDocument();

    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ resultados: [] }),
    });

    await waitFor(() => {
      expect(queryByRole("status")).toBeInTheDocument();
    });
  });

  describe("query type routing", () => {
    it("routes 6-digit CN query to /api/cima?cn=<query>", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Med",
                pactivos: "PA",
                aineAnalysis: { status: "GREEN" },
              },
            ],
          }),
      });

      await fill(input, "654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
      });
    });

    it("routes 7-digit CN query to /api/cima?cn=<query>", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Med",
                pactivos: "PA",
                aineAnalysis: { status: "GREEN" },
              },
            ],
          }),
      });

      await fill(input, "7654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=7654321");
      });
    });

    it("extracts CN from EAN-13 and routes to /api/cima?cn=<extractedCN>", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Med",
                pactivos: "PA",
                aineAnalysis: { status: "GREEN" },
              },
            ],
          }),
      });

      await fill(input, "8470006543215");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
      });
    });

    it("routes alphanumeric name query to /api/cima?nombre=<query>", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Ibuprofeno",
                pactivos: "IBUPROFENO",
                aineAnalysis: { status: "RED", matchedAines: [] },
              },
            ],
          }),
      });

      await fill(input, "ibuprofeno");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/cima?nombre=ibuprofeno",
        );
      });
    });
  });

  describe("CN fallback behavior", () => {
    it("retries with nombre when CN query returns 404", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: "Not found" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              resultados: [
                {
                  nombre: "Med",
                  pactivos: "PA",
                  aineAnalysis: { status: "GREEN" },
                },
              ],
            }),
        });

      await fill(input, "654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?nombre=654321");
      });
    });

    it("retries with nombre when CN query returns empty resultados", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ resultados: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              resultados: [
                {
                  nombre: "Med",
                  pactivos: "PA",
                  aineAnalysis: { status: "GREEN" },
                },
              ],
            }),
        });

      await fill(input, "654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?nombre=654321");
      });
    });

    it("does not retry when CN query succeeds with results", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            resultados: [
              {
                nombre: "Med",
                pactivos: "PA",
                aineAnalysis: { status: "GREEN" },
              },
            ],
          }),
      });

      await fill(input, "654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
      });
    });

    it("shows empty state when CN fallback also returns empty", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container, getByRole } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ resultados: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ resultados: [] }),
        });

      await fill(input, "654321");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
        const status = getByRole("status");
        expect(status).toBeInTheDocument();
        expect(status.textContent).toContain(
          "No se han encontrado medicamentos",
        );
      });
    });

    it("shows empty state for name query with no fallback", async () => {
      const { default: SearchBar } = await import("./search-bar");
      const { container, getByRole } = renderWithProvider(<SearchBar />);
      const input = container.querySelector('input[type="text"]')!;
      const form = container.querySelector("form")!;

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ resultados: [] }),
      });

      await fill(input, "xyz");
      await submit(form);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith("/api/cima?nombre=xyz");
        const status = getByRole("status");
        expect(status).toBeInTheDocument();
        expect(status.textContent).toContain(
          "No se han encontrado medicamentos",
        );
      });
    });
  });
});
