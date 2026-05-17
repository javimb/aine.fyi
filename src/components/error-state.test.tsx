import { describe, it, expect, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { NextIntlClientProvider } from "next-intl";

afterEach(cleanup);

const messages = {
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

describe("ErrorState", () => {
  it("renders the error message from the message prop", async () => {
    const { default: ErrorState } = await import("./error-state");
    const { getByText } = renderWithProvider(
      <ErrorState message="Something went wrong" onRetry={vi.fn()} />,
    );
    expect(getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a retry button with text from errorState.retry", async () => {
    const { default: ErrorState } = await import("./error-state");
    const { getByRole } = renderWithProvider(
      <ErrorState message="Error" onRetry={vi.fn()} />,
    );
    expect(getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("calls onRetry callback when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    const { default: ErrorState } = await import("./error-state");
    const { getByRole } = renderWithProvider(
      <ErrorState message="Error" onRetry={onRetry} />,
    );
    fireEvent.click(getByRole("button", { name: "Reintentar" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('has role="alert" on the message container', async () => {
    const { default: ErrorState } = await import("./error-state");
    const { getByRole } = renderWithProvider(
      <ErrorState message="Error" onRetry={vi.fn()} />,
    );
    expect(getByRole("alert")).toBeInTheDocument();
  });

  it('has aria-live="polite" on the message container', async () => {
    const { default: ErrorState } = await import("./error-state");
    const { container } = renderWithProvider(
      <ErrorState message="Error" onRetry={vi.fn()} />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveAttribute("aria-live", "polite");
  });

  it("uses text-status-red on the error message text", async () => {
    const { default: ErrorState } = await import("./error-state");
    const { getByText } = renderWithProvider(
      <ErrorState message="Something went wrong" onRetry={vi.fn()} />,
    );
    expect(getByText("Something went wrong")).toHaveClass("text-status-red");
  });

  it("renders a WarningIcon before the error message", async () => {
    const { default: ErrorState } = await import("./error-state");
    const { container } = renderWithProvider(
      <ErrorState message="Error" onRetry={vi.fn()} />,
    );
    const warningIcon = container.querySelector('[aria-hidden="true"]');
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon?.textContent).toContain("⚠️");
  });
});
