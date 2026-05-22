import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
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
    emptyResults: "No se han encontrado medicamentos.",
    scanButtonLabel: "Escanear código de barras",
    scannerTitle: "Apunta al código de barras",
    scannerStatus: "Escaneando...",
    scannerDetected: "Código detectado",
    scannerPermissionDenied:
      "No se pudo acceder a la cámara. Puedes escribir el código manualmente.",
    closeScannerLabel: "Cerrar escáner",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="es-ES" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("ScannerOverlay", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.doUnmock("@/hooks/use-barcode-scanner");
  });

  it("renders as role=dialog with aria-label when open", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: true,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const { getByRole } = renderWithProvider(
      <ScannerOverlay open={true} onClose={() => {}} />,
    );

    const dialog = getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Apunta al código de barras");
  });

  it("close button has aria-label from i18n and calls onClose", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: true,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const onClose = vi.fn();
    const { getByRole } = renderWithProvider(
      <ScannerOverlay open={true} onClose={onClose} />,
    );

    const user = userEvent.setup();
    await user.click(getByRole("button", { name: "Cerrar escáner" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("Escape key calls onClose", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: true,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const onClose = vi.fn();
    renderWithProvider(<ScannerOverlay open={true} onClose={onClose} />);

    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("aria-live=polite region announces detection", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: false,
        lastDetected: "8470006543215",
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const { getByRole } = renderWithProvider(
      <ScannerOverlay open={true} onClose={() => {}} />,
    );

    const log = getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveTextContent("Código detectado");
  });

  it("permission-denied state shows message with retry and dismiss buttons", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: false,
        lastDetected: null,
        error: "permission_denied",
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const onClose = vi.fn();
    const { getByRole, getByText } = renderWithProvider(
      <ScannerOverlay open={true} onClose={onClose} />,
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

  it("status text shows while scanning", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: true,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const { getByText } = renderWithProvider(
      <ScannerOverlay open={true} onClose={() => {}} />,
    );

    expect(getByText("Escaneando...")).toBeInTheDocument();
  });
});
