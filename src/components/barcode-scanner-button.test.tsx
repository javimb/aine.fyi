import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
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
    scannerPermissionDenied: "No se pudo acceder a la cámara.",
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

describe("BarcodeScannerButton", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.doUnmock("@/hooks/use-barcode-scanner");
  });

  it("renders button with ScanBarcode icon and aria-label when camera is supported", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: false,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: BarcodeScannerButton } =
      await import("./barcode-scanner-button");
    const { getByRole } = renderWithProvider(
      <BarcodeScannerButton onOpenScanner={() => {}} />,
    );

    const button = getByRole("button", { name: "Escanear código de barras" });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render when getUserMedia is unavailable", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: false,
        isScanning: false,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: BarcodeScannerButton } =
      await import("./barcode-scanner-button");
    const { container } = renderWithProvider(
      <BarcodeScannerButton onOpenScanner={() => {}} />,
    );

    expect(container.querySelector("button")).not.toBeInTheDocument();
  });

  it("calls onOpenScanner when clicked", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: false,
        lastDetected: null,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    }));

    const { default: BarcodeScannerButton } =
      await import("./barcode-scanner-button");
    const onOpenScanner = vi.fn();
    const { getByRole } = renderWithProvider(
      <BarcodeScannerButton onOpenScanner={onOpenScanner} />,
    );

    const user = userEvent.setup();
    await user.click(
      getByRole("button", { name: "Escanear código de barras" }),
    );

    expect(onOpenScanner).toHaveBeenCalledOnce();
  });
});
