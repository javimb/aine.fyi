import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

afterEach(cleanup);

const messages = {
  emptyState: {
    title: 'No encontramos "{query}"',
    tipHeading: "Sugerencias",
    tipSpelling: "Revisa la ortografía del nombre",
    tipGeneric: "Prueba con el nombre genérico (principio activo)",
    tipBrand: "Prueba con el nombre comercial del medicamento",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("EmptyState", () => {
  it("renders with the query interpolated in the title", async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { getByText } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    expect(getByText('No encontramos "ibuprofeno"')).toBeInTheDocument();
  });

  it("renders a tips heading from emptyState.tipHeading", async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { getByText } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    expect(getByText("Sugerencias")).toBeInTheDocument();
  });

  it("renders all three tips", async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { getByText } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    expect(getByText("Revisa la ortografía del nombre")).toBeInTheDocument();
    expect(
      getByText("Prueba con el nombre genérico (principio activo)"),
    ).toBeInTheDocument();
    expect(
      getByText("Prueba con el nombre comercial del medicamento"),
    ).toBeInTheDocument();
  });

  it('has role="status" on the outer container', async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { getByRole } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    expect(getByRole("status")).toBeInTheDocument();
  });

  it('has aria-live="polite" on the outer container', async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { container } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    const status = container.querySelector('[role="status"]');
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("has rounded-lg and p-4 classes on the card element", async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { container } = renderWithProvider(<EmptyState query="ibuprofeno" />);
    const card = container.querySelector('[role="status"]');
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("p-4");
  });

  it("uses useTranslations with emptyState namespace", async () => {
    const { default: EmptyState } = await import("./empty-state");
    const { getByText } = renderWithProvider(<EmptyState query="test" />);
    expect(getByText('No encontramos "test"')).toBeInTheDocument();
    expect(getByText("Sugerencias")).toBeInTheDocument();
  });
});
