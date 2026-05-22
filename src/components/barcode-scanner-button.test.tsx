import { describe, it, expect, vi, afterEach } from "vitest";
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
    scannerRetryLabel: "Reintentar",
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
  it("renders button with svg icon and aria-label when isSupported is true", () => {
    const { getByRole } = renderWithProvider(
      <BarcodeScannerButton isSupported={true} onOpenScanner={() => {}} />,
    );

    const button = getByRole("button", { name: "Escanear código de barras" });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render when isSupported is false", () => {
    const { container } = renderWithProvider(
      <BarcodeScannerButton isSupported={false} onOpenScanner={() => {}} />,
    );

    expect(container.querySelector("button")).not.toBeInTheDocument();
  });

  it("calls onOpenScanner when clicked", async () => {
    const onOpenScanner = vi.fn();
    const { getByRole } = renderWithProvider(
      <BarcodeScannerButton isSupported={true} onOpenScanner={onOpenScanner} />,
    );

    const user = userEvent.setup();
    await user.click(
      getByRole("button", { name: "Escanear código de barras" }),
    );

    expect(onOpenScanner).toHaveBeenCalledOnce();
  });
});

import BarcodeScannerButton from "./barcode-scanner-button";
