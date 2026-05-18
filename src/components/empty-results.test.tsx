import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

afterEach(cleanup);

const messages = {
  search: {
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

describe("EmptyResults", () => {
  it("renders the message from i18n key search.emptyResults", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { getByText } = renderWithProvider(<EmptyResults />);
    expect(
      getByText(/No se han encontrado medicamentos con ese nombre/),
    ).toBeInTheDocument();
  });

  it("renders with role=status for screen reader announcement", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[role='status']");
    expect(message).toBeInTheDocument();
    expect(message?.textContent).toContain("No se han encontrado medicamentos");
  });

  it("renders with aria-live=polite", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[aria-live='polite']");
    expect(message).toBeInTheDocument();
  });

  it("uses muted text styling without any status color class", async () => {
    const { default: EmptyResults } = await import("./empty-results");
    const { container } = renderWithProvider(<EmptyResults />);
    const message = container.querySelector("[role='status']");
    expect(message?.className).toContain("text-muted-foreground");
    expect(message?.className).not.toContain("text-status-red");
    expect(message?.className).not.toContain("text-status-amber");
    expect(message?.className).not.toContain("text-status-yellow");
    expect(message?.className).not.toContain("text-status-green");
  });
});
