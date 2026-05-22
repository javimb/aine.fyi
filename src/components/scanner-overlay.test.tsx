import { describe, it, expect, vi, afterEach } from "vitest";
import { createRef } from "react";
import { render, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import ScannerOverlay from "./scanner-overlay";

afterEach(cleanup);

const messages = {
  search: {
    formLabel: "Buscar medicamento",
    inputLabel: "Nombre del medicamento",
    placeholder: "Buscar medicamento...",
    button: "Buscar",
    buttonLoading: "Buscando...",
    error: "Error al buscar",
    emptyResults: "No se han encontrado medicamentos.",
    scanButtonLabel: "Escanear código de barras",
    scannerTitle: "Apunta al código de barras",
    scannerStatus: "Escaneando...",
    scannerDetected: "Código detectado",
    scannerPermissionDenied:
      "No se pudo acceder a la cámara. Puedes escribir el código manualmente.",
    scannerRetryLabel: "Reintentar",
    closeScannerLabel: "Cerrar escáner",
  },
};

const containerRef = createRef<HTMLDivElement>();

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  isScanning: true,
  lastDetected: null,
  error: null as string | null,
  startScanning: vi.fn(),
  stopScanning: vi.fn(),
  containerRef,
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("ScannerOverlay", () => {
  it("renders as role=dialog with aria-label when open", () => {
    const { getByRole } = renderWithProvider(
      <ScannerOverlay {...defaultProps} />,
    );

    const dialog = getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Apunta al código de barras");
  });

  it("close button has aria-label from i18n and calls onClose", async () => {
    const onClose = vi.fn();
    const { getByRole } = renderWithProvider(
      <ScannerOverlay {...defaultProps} onClose={onClose} />,
    );

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: "Cerrar escáner" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("Escape key calls onClose", async () => {
    const onClose = vi.fn();
    renderWithProvider(<ScannerOverlay {...defaultProps} onClose={onClose} />);

    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("aria-live=polite region announces detection", () => {
    const { getByRole } = renderWithProvider(
      <ScannerOverlay {...defaultProps} lastDetected="8470006543215" />,
    );

    const log = getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveTextContent("Código detectado");
  });

  it("permission-denied state shows message with retry and dismiss buttons", async () => {
    const onClose = vi.fn();
    const startScanning = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <ScannerOverlay
        {...defaultProps}
        isScanning={false}
        error="permission_denied"
        startScanning={startScanning}
        onClose={onClose}
      />,
    );

    expect(
      getByText(
        "No se pudo acceder a la cámara. Puedes escribir el código manualmente.",
      ),
    ).toBeInTheDocument();

    const alert = getByRole("alert");
    expect(alert).toBeInTheDocument();

    expect(getByText("Reintentar")).toBeInTheDocument();

    const dismissButton = within(alert).getByRole("button", {
      name: "Cerrar escáner",
    });
    expect(dismissButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(dismissButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("status text shows while scanning", () => {
    const { getByText } = renderWithProvider(
      <ScannerOverlay {...defaultProps} isScanning={true} />,
    );

    expect(getByText("Escaneando...")).toBeInTheDocument();
  });
});
