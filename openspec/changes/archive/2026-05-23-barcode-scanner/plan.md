# Barcode Scanner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add camera-based EAN-13 barcode scanning to the SearchBar, enabling users to scan medication barcodes instead of typing them manually.

**Architecture:** A `useBarcodeScanner` hook manages QuaggaJS initialization, camera permissions, and detection state. `BarcodeScannerButton` triggers the scanner overlay, and `ScannerOverlay` provides a full-screen camera view with accessibility support. The detected barcode flows into the existing SearchBar `handleSearch` pipeline without modifying the search logic.

**Tech Stack:** React 19, Next.js 16, `@ericblade/quagga2`, `lucide-react` (ScanBarcode), `next-intl`, Vitest, Testing Library

---

## Task 1: Install QuaggaJS dependency

**Files:**

- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install @ericblade/quagga2**

Run:

```bash
npm install @ericblade/quagga2
```

Expected: `package.json` gains `@ericblade/quagga2` in `dependencies`. `package-lock.json` is updated.

- [ ] **Step 2: Verify installation succeeds**

Run:

```bash
npm ls @ericblade/quagga2
```

Expected: Output shows the installed version with no unmet dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add @ericblade/quagga2 for barcode scanning"
```

---

## Task 2: Add scanner i18n keys

**Files:**

- Modify: `messages/es-ES.json`
- Modify: `src/i18n/messages.test.ts`
- Test: `src/i18n/messages.test.ts`

- [ ] **Step 1: Write failing test: verify scanner keys exist in messages/es-ES.json**

Edit `src/i18n/messages.test.ts` — add a new `describe` block after the existing tests:

```ts
describe("search namespace scanner keys", () => {
  const SCANNER_KEYS = [
    "scanButtonLabel",
    "scannerTitle",
    "scannerStatus",
    "scannerDetected",
    "scannerPermissionDenied",
    "closeScannerLabel",
  ];

  it.each(SCANNER_KEYS)("has search.%s key", (key) => {
    expect(messages.search).toHaveProperty(key);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/i18n/messages.test.ts
```

Expected: FAIL — each scanner key is missing from `messages.search`.

- [ ] **Step 3: Add the six scanner i18n keys to messages/es-ES.json**

Edit `messages/es-ES.json` — add the following keys inside the `"search"` object, after `"error"`:

```json
"scanButtonLabel": "Escanear código de barras",
"scannerTitle": "Apunta al código de barras",
"scannerStatus": "Escaneando...",
"scannerDetected": "Código detectado",
"scannerPermissionDenied": "No se pudo acceder a la cámara. Puedes escribir el código manualmente.",
"closeScannerLabel": "Cerrar escáner",
```

The `search` section should now contain: `formLabel`, `inputLabel`, `placeholder`, `button`, `buttonLoading`, `error`, `emptyResults`, `scanButtonLabel`, `scannerTitle`, `scannerStatus`, `scannerDetected`, `scannerPermissionDenied`, `closeScannerLabel`.

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npx vitest run src/i18n/messages.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add messages/es-ES.json src/i18n/messages.test.ts
git commit -m "feat(i18n): add barcode scanner translation keys"
```

---

## Task 3: Create useBarcodeScanner hook

**Files:**

- Create: `src/hooks/use-barcode-scanner.ts`
- Create: `src/hooks/use-barcode-scanner.test.ts`

- [ ] **Step 1: Write failing test: hook returns isSupported=false when getUserMedia unavailable**

Create `src/hooks/use-barcode-scanner.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

function mockQuagga(detectedCode?: string) {
  const onDetectedCallbacks: Array<
    (result: { codeResult: { code: string } }) => void
  > = [];
  const start = vi.fn().mockImplementation((config) => {
    config?.onDetected?.({
      codeResult: { code: detectedCode ?? "8470006543215" },
    });
  });
  const stop = vi.fn();
  return {
    onDetectedCallbacks,
    start,
    stop,
  };
}

describe("useBarcodeScanner", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns isSupported=false when getUserMedia is unavailable", async () => {
    const original = navigator.mediaDevices;
    Object.defineProperty(navigator, "mediaDevices", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { useBarcodeScanner } = await import("./use-barcode-scanner");
    const { result } = renderHook(() => useBarcodeScanner());

    expect(result.current.isSupported).toBe(false);

    Object.defineProperty(navigator, "mediaDevices", {
      value: original,
      writable: true,
      configurable: true,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/hooks/use-barcode-scanner.test.ts
```

Expected: FAIL — module `use-barcode-scanner` does not exist yet.

- [ ] **Step 3: Write minimal implementation — isSupported check**

Create `src/hooks/use-barcode-scanner.ts`:

```ts
"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseBarcodeScannerReturn {
  isSupported: boolean;
  isScanning: boolean;
  lastDetected: string | null;
  error: string | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
}

export function useBarcodeScanner(): UseBarcodeScannerReturn {
  const isSupported =
    typeof navigator !== "undefined" &&
    navigator.mediaDevices !== undefined &&
    typeof navigator.mediaDevices.getUserMedia === "function";

  const [isScanning, setIsScanning] = useState(false);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastDetectionTime = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startScanning = useCallback(async () => {
    if (!isSupported) return;
    setError(null);
    setLastDetected(null);
    try {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const constraints: MediaStreamConstraints = isMobile
        ? { video: { facingMode: "environment" } }
        : { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
    } catch {
      setError("permission_denied");
      return;
    }
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    isSupported,
    isScanning,
    lastDetected,
    error,
    startScanning,
    stopScanning,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npx vitest run src/hooks/use-barcode-scanner.test.ts
```

Expected: PASS — `isSupported` returns `false` when `mediaDevices` is undefined.

- [ ] **Step 5: Write failing test: startScanning requests camera and sets isScanning=true**

Add to `src/hooks/use-barcode-scanner.test.ts` inside the `describe` block:

```ts
it("sets isScanning=true after startScanning succeeds", async () => {
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  });
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  expect(result.current.isSupported).toBe(true);

  await act(async () => {
    await result.current.startScanning();
  });

  expect(result.current.isScanning).toBe(true);
  expect(mockGetUserMedia).toHaveBeenCalled();

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run:

```bash
npx vitest run src/hooks/use-barcode-scanner.test.ts
```

Expected: FAIL — `startScanning` doesn't exist yet or doesn't set `isScanning`.

- [ ] **Step 7: Implement startScanning with camera initialization and QuaggaJS**

Update the `startScanning` in `src/hooks/use-barcode-scanner.ts` to initialize QuaggaJS and set `isScanning`:

```ts
const startScanning = useCallback(async () => {
  if (!isSupported) return;
  setError(null);
  setLastDetected(null);
  try {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const constraints: MediaStreamConstraints = isMobile
      ? { video: { facingMode: "environment" } }
      : { video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    streamRef.current = stream;

    const Quagga = (await import("@ericblade/quagga2")).default;
    await new Promise<void>((resolve, reject) => {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.body,
            constraints: isMobile ? { facingMode: "environment" } : {},
          },
          decoder: {
            readers: ["ean_reader"],
          },
          locate: true,
          frequency: 10,
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      if (!code || !/^\d{13}$/.test(code)) return;
      const now = Date.now();
      if (now - lastDetectionTime.current < 2000) return;
      lastDetectionTime.current = now;
      setLastDetected(code);
      stopScanning();
    });

    Quagga.start();
    setIsScanning(true);
  } catch {
    setError("permission_denied");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }
}, [isSupported, stopScanning]);
```

- [ ] **Step 8: Write failing test: detection of valid 13-digit code sets lastDetected and calls stopScanning**

Add to test file:

```ts
it("sets lastDetected on valid 13-digit barcode and stops scanning", async () => {
  const mockTrackStop = vi.fn();
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: mockTrackStop }],
  });
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  vi.doMock("@ericblade/quagga2", () => ({
    default: {
      init: vi.fn().mockImplementation((_, cb) => cb(null)),
      onDetected: vi.fn().mockImplementation((cb) => {
        cb({ codeResult: { code: "8470006543215" } });
      }),
      start: vi.fn(),
      stop: vi.fn(),
      offDetected: vi.fn(),
    },
  }));

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  expect(result.current.lastDetected).toBe("8470006543215");

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@ericblade/quagga2");
});
```

- [ ] **Step 9: Write failing test: detection of non-13-digit code is ignored**

Add to test file:

```ts
it("ignores detection of non-13-digit codes", async () => {
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  });
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  vi.doMock("@ericblade/quagga2", () => ({
    default: {
      init: vi.fn().mockImplementation((_, cb) => cb(null)),
      onDetected: vi.fn().mockImplementation((cb) => {
        cb({ codeResult: { code: "12345" } });
      }),
      start: vi.fn(),
      stop: vi.fn(),
      offDetected: vi.fn(),
    },
  }));

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  expect(result.current.lastDetected).toBeNull();

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@ericblade/quagga2");
});
```

- [ ] **Step 10: Write failing test: 2-second debounce prevents duplicate detections**

Add to test file:

```ts
it("debounces detections within 2 seconds", async () => {
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: vi.fn() }],
  });
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  let detectionCallback: (result: {
    codeResult: { code: string };
  }) => void = () => {};
  vi.doMock("@ericblade/quagga2", () => ({
    default: {
      init: vi.fn().mockImplementation((_, cb) => cb(null)),
      onDetected: vi.fn().mockImplementation((cb) => {
        detectionCallback = cb;
      }),
      start: vi.fn(),
      stop: vi.fn(),
      offDetected: vi.fn(),
    },
  }));

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  act(() => {
    detectionCallback({ codeResult: { code: "8470006543215" } });
  });

  expect(result.current.lastDetected).toBe("8470006543215");

  vi.advanceTimersByTime(500);

  act(() => {
    detectionCallback({ codeResult: { code: "8470006543210" } });
  });

  expect(result.current.lastDetected).toBe("8470006543215");

  vi.advanceTimersByTime(2000);

  act(() => {
    detectionCallback({ codeResult: { code: "8470006543210" } });
  });

  expect(result.current.lastDetected).toBe("8470006543210");

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@ericblade/quagga2");
});
```

- [ ] **Step 11: Write failing test: camera permission denial sets error state**

Add to test file:

```ts
it("sets error state when camera permission is denied", async () => {
  const mockGetUserMedia = vi
    .fn()
    .mockRejectedValue(new DOMError("NotAllowedError"));
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  expect(result.current.error).toBe("permission_denied");
  expect(result.current.isScanning).toBe(false);

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
});
```

> Note: The `DOMError` constructor may not exist in jsdom. Use a plain `Error` or `DOMException`:
>
> ```ts
> const mockGetUserMedia = vi
>   .fn()
>   .mockRejectedValue(
>     new DOMException("Permission denied", "NotAllowedError"),
>   );
> ```

- [ ] **Step 12: Write failing test: stopScanning tears down QuaggaJS and releases camera tracks**

Add to test file:

```ts
it("stops QuaggaJS and releases camera tracks on stopScanning", async () => {
  const mockTrackStop = vi.fn();
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: mockTrackStop }],
  });
  const mockQuaggaStop = vi.fn();
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  vi.doMock("@ericblade/quagga2", () => ({
    default: {
      init: vi.fn().mockImplementation((_, cb) => cb(null)),
      onDetected: vi.fn(),
      start: vi.fn(),
      stop: mockQuaggaStop,
      offDetected: vi.fn(),
    },
  }));

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  act(() => {
    result.current.stopScanning();
  });

  expect(mockTrackStop).toHaveBeenCalled();

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@ericblade/quagga2");
});
```

- [ ] **Step 13: Write failing test: cleanup on unmount stops camera tracks**

Add to test file:

```ts
it("stops camera tracks on unmount", async () => {
  const mockTrackStop = vi.fn();
  const mockGetUserMedia = vi.fn().mockResolvedValue({
    getTracks: () => [{ stop: mockTrackStop }],
  });
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: mockGetUserMedia },
    writable: true,
    configurable: true,
  });

  vi.doMock("@ericblade/quagga2", () => ({
    default: {
      init: vi.fn().mockImplementation((_, cb) => cb(null)),
      onDetected: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      offDetected: vi.fn(),
    },
  }));

  const { useBarcodeScanner } = await import("./use-barcode-scanner");
  const { result, unmount } = renderHook(() => useBarcodeScanner());

  await act(async () => {
    await result.current.startScanning();
  });

  unmount();

  expect(mockTrackStop).toHaveBeenCalled();

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@ericblade/quagga2");
});
```

- [ ] **Step 14: Ensure all hook tests pass**

Update the `use-barcode-scanner.ts` implementation to handle all test cases correctly. The full implementation must:

1. Check `navigator.mediaDevices?.getUserMedia` for `isSupported`
2. Initialize QuaggaJS in `startScanning` with `ean_reader`, `locate: true`, `frequency: 10`
3. Detect 13-digit EAN-13 codes, ignoring non-13-digit codes
4. Debounce detections with a 2-second window (`lastDetectionTime` ref)
5. Set `lastDetected` and call `stopScanning` on valid detection
6. Set `error: "permission_denied"` when camera access is denied
7. Stop QuaggaJS and release camera tracks in `stopScanning`
8. Clean up on unmount — always stop camera tracks

Run:

```bash
npx vitest run src/hooks/use-barcode-scanner.test.ts
```

Expected: All tests PASS.

- [ ] **Step 15: Commit**

```bash
git add src/hooks/use-barcode-scanner.ts src/hooks/use-barcode-scanner.test.ts
git commit -m "feat(hook): add useBarcodeScanner hook with QuaggaJS integration"
```

---

## Task 4: Create BarcodeScannerButton component

**Files:**

- Create: `src/components/barcode-scanner-button.tsx`
- Create: `src/components/barcode-scanner-button.test.tsx`

- [ ] **Step 1: Write failing test: button renders with ScanBarcode icon and aria-label when camera is supported**

Create `src/components/barcode-scanner-button.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NextIntlClientProvider } from "next-intl";

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
  afterEach(cleanup);

  it("renders with ScanBarcode icon and aria-label when camera is supported", async () => {
    const original = navigator.mediaDevices;
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: vi.fn() },
      writable: true,
      configurable: true,
    });

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
      <BarcodeScannerButton onOpenScanner={vi.fn()} />,
    );

    const button = getByRole("button", { name: /escanear código de barras/i });
    expect(button).toBeInTheDocument();

    Object.defineProperty(navigator, "mediaDevices", {
      value: original,
      writable: true,
      configurable: true,
    });
    vi.doUnmock("@/hooks/use-barcode-scanner");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/components/barcode-scanner-button.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write failing test: button does not render when getUserMedia unavailable**

Add to test file inside `describe`:

```ts
it("does not render when getUserMedia is unavailable", async () => {
  const original = navigator.mediaDevices;
  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });

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

  const { default: BarcodeScannerButton } = await import("./barcode-scanner-button");
  const { container } = renderWithProvider(<BarcodeScannerButton onOpenScanner={vi.fn()} />);

  expect(container.querySelector("button")).toBeNull();

  Object.defineProperty(navigator, "mediaDevices", {
    value: original,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 4: Write failing test: button calls onOpenScanner when clicked**

Add to test file inside `describe`:

```ts
it("calls onOpenScanner when clicked", async () => {
  const onOpenScanner = vi.fn();

  vi.do mock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({
      isSupported: true,
      isScanning: false,
      lastDetected: null,
      error: null,
      startScanning: vi.fn(),
      stopScanning: vi.fn(),
    }),
  }));

  const { default: BarcodeScannerButton } = await import("./barcode-scanner-button");
  const { getByRole } = renderWithProvider(<BarcodeScannerButton onOpenScanner={onOpenScanner} />);

  const button = getByRole("button", { name: /escanear código de barras/i });
  await userEvent.click(button);

  expect(onOpenScanner).toHaveBeenCalledOnce();

  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

> Add `import userEvent from "@testing-library/user-event";` at the top if not already present, and add `const user = userEvent.setup();` inside the test, changing `await userEvent.click(button)` to `await user.click(button)`.

- [ ] **Step 5: Implement BarcodeScannerButton component**

Create `src/components/barcode-scanner-button.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";

interface BarcodeScannerButtonProps {
  onOpenScanner: () => void;
}

export default function BarcodeScannerButton({
  onOpenScanner,
}: BarcodeScannerButtonProps) {
  const t = useTranslations("search");
  const { isSupported } = useBarcodeScanner();

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t("scanButtonLabel")}
      onClick={onOpenScanner}
    >
      <ScanBarcode className="size-5" />
    </Button>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:

```bash
npx vitest run src/components/barcode-scanner-button.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/barcode-scanner-button.tsx src/components/barcode-scanner-button.test.tsx
git commit -m "feat(ui): add BarcodeScannerButton component"
```

---

## Task 5: Create ScannerOverlay component

**Files:**

- Create: `src/components/scanner-overlay.tsx`
- Create: `src/components/scanner-overlay.test.tsx`

- [ ] **Step 1: Write failing test: overlay renders as role=dialog with aria-label when open**

Create `src/components/scanner-overlay.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { NextIntlClientProvider } from "next-intl";

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

const mockUseBarcodeScanner = {
  isSupported: true,
  isScanning: true,
  lastDetected: null,
  error: null,
  startScanning: vi.fn(),
  stopScanning: vi.fn(),
};

describe("ScannerOverlay", () => {
  afterEach(cleanup);

  it("renders as dialog with aria-label when open", async () => {
    vi.doMock("@/hooks/use-barcode-scanner", () => ({
      useBarcodeScanner: () => ({ ...mockUseBarcodeScanner }),
    }));

    const { default: ScannerOverlay } = await import("./scanner-overlay");
    const { getByRole } = renderWithProvider(
      <ScannerOverlay open={true} onClose={vi.fn()} />,
    );

    expect(getByRole("dialog")).toHaveAttribute(
      "aria-label",
      "Apunta al código de barras",
    );

    vi.doUnmock("@/hooks/use-barcode-scanner");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/components/scanner-overlay.test.tsx
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write failing test: close button has aria-label and calls onClose**

Add to test file:

```ts
it("close button has aria-label from i18n and calls onClose", async () => {
  const onClose = vi.fn();

  vi.doMock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({ ...mockUseBarcodeScanner }),
  }));

  const { default: ScannerOverlay } = await import("./scanner-overlay");
  const { getByRole } = renderWithProvider(
    <ScannerOverlay open={true} onClose={onClose} />,
  );

  const closeButton = getByRole("button", { name: /cerrar escáner/i });
  expect(closeButton).toBeInTheDocument();

  const user = userEvent.setup();
  await user.click(closeButton);
  expect(onClose).toHaveBeenCalledOnce();

  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 4: Write failing test: Escape key calls onClose**

Add to test file:

```ts
it("calls onClose when Escape key is pressed", async () => {
  const onClose = vi.fn();

  vi.doMock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({ ...mockUseBarcodeScanner }),
  }));

  const { default: ScannerOverlay } = await import("./scanner-overlay");
  const { getByRole } = renderWithProvider(
    <ScannerOverlay open={true} onClose={onClose} />,
  );

  const dialog = getByRole("dialog");
  const user = userEvent.setup();
  await user.type(dialog, "{Escape}");
  expect(onClose).toHaveBeenCalled();

  vi.doUnmock("@/ hooks/use-barcode-scanner");
});
```

- [ ] **Step 5: Write failing test: aria-live=polite region announces detection**

Add to test file:

```ts
it("announces detection via aria-live=polite region", async () => {
  vi.doMock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({
      ...mockUseBarcodeScanner,
      lastDetected: "8470006543215",
    }),
  }));

  const { default: ScannerOverlay } = await import("./scanner-overlay");
  const { getByRole } = renderWithProvider(
    <ScannerOverlay open={true} onClose={vi.fn()} />,
  );

  const liveRegion = getByRole("log");
  expect(liveRegion).toHaveAttribute("aria-live", "polite");
  expect(liveRegion).toHaveTextContent("Código detectado");

  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 6: Write failing test: permission-denied state shows message with retry and dismiss buttons**

Add to test file:

```ts
it("shows permission-denied state with retry and dismiss buttons", async () => {
  const onClose = vi.fn();
  const startScanning = vi.fn();

  vi.doMock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({
      ...mockUseBarcodeScanner,
      isScanning: false,
      error: "permission_denied",
      startScanning,
    }),
  }));

  const { default: ScannerOverlay } = await import("./scanner-overlay");
  const { getByRole, getByText } = renderWithProvider(
    <ScannerOverlay open={true} onClose={onClose} />,
  );

  expect(getByText("No se pudo acceder a la cámara.")).toBeInTheDocument();
  expect(getByRole("button", { name: /reintentar/i })).toBeInTheDocument();
  expect(getByRole("button", { name: /cerrar/i })).toBeInTheDocument();

  const user = userEvent.setup();
  await user.click(getByRole("button", { name: /cerrar/i }));
  expect(onClose).toHaveBeenCalledOnce();

  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

> Note: The dismiss button's label should match the i18n key text. Adjust the test matcher if the actual dismiss label differs. Consider using the `search.closeScannerLabel` value ("Cerrar escáner") or a dedicated key.

- [ ] **Step 7: Write failing test: status indicator shows while scanning**

Add to test file:

```ts
it("displays status text while scanning", async () => {
  vi.doMock("@/hooks/use-barcode-scanner", () => ({
    useBarcodeScanner: () => ({
      ...mockUseBarcodeScanner,
      isScanning: true,
    }),
  }));

  const { default: ScannerOverlay } = await import("./scanner-overlay");
  const { getByText } = renderWithProvider(
    <ScannerOverlay open={true} onClose={vi.fn()} />,
  );

  expect(getByText("Escaneando...")).toBeInTheDocument();

  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 8: Implement ScannerOverlay component**

Create `src/components/scanner-overlay.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";
import { Button } from "@/components/ui/button";

interface ScannerOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function ScannerOverlay({ open, onClose }: ScannerOverlayProps) {
  const t = useTranslations("search");
  const { isScanning, lastDetected, error, startScanning, stopScanning } =
    useBarcodeScanner();
  const dialogRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      startScanning();
    }
    return () => {
      if (open) stopScanning();
    };
  }, [open, startScanning, stopScanning]);

  useEffect(() => {
    if (lastDetected !== null) {
      if (flashRef.current) {
        flashRef.current.classList.add("bg-green-500/30");
        setTimeout(() => {
          flashRef.current?.classList.remove("bg-green-500/30");
        }, 300);
      }
      const timeout = setTimeout(onClose, 300);
      return () => clearTimeout(timeout);
    }
  }, [lastDetected, onClose]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={t("scannerTitle")}
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
    >
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 transition-colors duration-300"
      />

      <div className="absolute right-4 top-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("closeScannerLabel")}
          onClick={onClose}
        >
          <X className="size-6 text-white" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 p-4">
        <p className="text-lg font-semibold text-white">{t("scannerTitle")}</p>

        <div className="h-48 w-64 border-2 border-dashed border-white/50" />

        {isScanning && (
          <p className="text-sm text-white/80">{t("scannerStatus")}</p>
        )}

        {error === "permission_denied" && (
          <div
            role="alert"
            className="flex flex-col items-center gap-2 text-center"
          >
            <p className="text-white">{t("scannerPermissionDenied")}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startScanning}
              >
                Reintentar
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                {t("closeScannerLabel")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div role="log" aria-live="polite" className="sr-only">
        {lastDetected !== null && t("scannerDetected")}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run:

```bash
npx vitest run src/components/scanner-overlay.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/scanner-overlay.tsx src/components/scanner-overlay.test.tsx
git commit -m "feat(ui): add ScannerOverlay component"
```

---

## Task 6: Integrate scanner into SearchBar

**Files:**

- Modify: `src/components/search-bar.tsx`
- Modify: `src/components/search-bar.test.tsx`

- [ ] **Step 1: Write failing test: SearchBar renders BarcodeScannerButton next to input on supported devices**

Add to `src/components/search-bar.test.tsx` — add to the `messages` object the new scanner keys, and add a new `describe` block:

```ts
// Add to the messages object in the test file:
// scanButtonLabel: "Escanear código de barras",
// scannerTitle: "Apunta al código de barras",
// scannerStatus: "Escaneando...",
// scannerDetected: "Código detectado",
// scannerPermissionDenied: "No se pudo acceder a la cámara.",
// closeScannerLabel: "Cerrar escáner",
```

Then add the test:

```ts
describe("barcode scanner integration", () => {
  it("renders BarcodeScannerButton next to input when camera is supported", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia: vi.fn() },
      writable: true,
      configurable: true,
    });

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

    const { default: SearchBar } = await import("./search-bar");
    const { getByRole } = renderWithProvider(<SearchBar />);

    expect(getByRole("button", { name: /escanear código de barras/i })).toBeInTheDocument();

    Object.defineProperty(navigator, "mediaDevices", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    vi.doUnmock("@/hooks/use-barcode-scanner");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npx vitest run src/components/search-bar.test.tsx
```

Expected: FAIL — SearchBar hasn't been updated yet, so no scan button renders.

- [ ] **Step 3: Write failing test: tapping scan button opens ScannerOverlay**

Add to the `describe("barcode scanner integration")` block:

```ts
it("opens ScannerOverlay when scan button is tapped", async () => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: vi.fn() },
    writable: true,
    configurable: true,
  });

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

  const { default: SearchBar } = await import("./search-bar");
  const { getByRole } = renderWithProvider(<SearchBar />);

  const scanButton = getByRole("button", { name: /escanear código de barras/i });
  const user = userEvent.setup();
  await user.click(scanButton);

  expect(getByRole("dialog")).toBeInTheDocument();

  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 4: Write failing test: detected barcode populates search input and auto-submits**

Add to the `describe("barcode scanner integration")` block:

```ts
it("populates search input and auto-submits on barcode detection", async () => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: vi.fn() },
    writable: true,
    configurable: true,
  });

  vi.doMock("@/hooks/use-barcode-scanner", () => {
    let lastDetected = "8470006543215";
    return {
      useBarcodeScanner: () => ({
        isSupported: true,
        isScanning: false,
        lastDetected,
        error: null,
        startScanning: vi.fn(),
        stopScanning: vi.fn(),
      }),
    };
  });

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

  const { default: SearchBar } = await import("./search-bar");
  const { container, getByRole } = renderWithProvider(<SearchBar />);

  const input = container.querySelector('input[type="text"]') as HTMLInputElement;
  expect(input).toHaveValue("8470006543215");

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("/api/cima?cn=654321");
  });

  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 5: Write failing test: overlay closing resets isScannerOpen state**

Add to the `describe("barcode scanner integration")` block:

```ts
it("resets scanner state when overlay closes", async () => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: vi.fn() },
    writable: true,
    configurable: true,
  });

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

  const { default: SearchBar } = await import("./search-bar");
  const { getByRole, queryByRole } = renderWithProvider(<SearchBar />);

  const scanButton = getByRole("button", { name: /escanear código de barras/i });
  const user = userEvent.setup();
  await user.click(scanButton);

  expect(getByRole("dialog")).toBeInTheDocument();

  const closeButton = getByRole("button", { name: /cerrar escáner/i });
  await user.click(closeButton);

  await waitFor(() => {
    expect(queryByRole("dialog")).not.toBeInTheDocument();
  });

  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 6: Write failing test: SearchBar hides scan button on unsupported devices**

Add to the `describe("barcode scanner integration")` block:

```ts
it("hides scan button on unsupported devices", async () => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });

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

  const { default: SearchBar } = await import("./search-bar");
  const { queryByRole } = renderWithProvider(<SearchBar />);

  expect(queryByRole("button", { name: /escanear código de barras/i })).not.toBeInTheDocument();

  Object.defineProperty(navigator, "mediaDevices", {
    value: undefined,
    writable: true,
    configurable: true,
  });
  vi.doUnmock("@/hooks/use-barcode-scanner");
});
```

- [ ] **Step 7: Integrate BarcodeScannerButton and ScannerOverlay into SearchBar**

Edit `src/components/search-bar.tsx` — add imports and integration:

Add at the top of the file, after the existing imports:

```tsx
import BarcodeScannerButton from "@/components/barcode-scanner-button";
import ScannerOverlay from "@/components/scanner-overlay";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";
```

Add state inside `SearchBar` component, after the existing `const [isEmpty, setIsEmpty] = useState(false);`:

```tsx
const [isScannerOpen, setIsScannerOpen] = useState(false);
```

Add the BarcodeScannerButton next to the submit Button, inside the `<form>`, after the `</Button>` for the submit button:

```tsx
<BarcodeScannerButton onOpenScanner={() => setIsScannerOpen(true)} />
```

Add the ScannerOverlay after the form closing tag, before the error section:

```tsx
<ScannerOverlay open={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
```

- [ ] **Step 8: Run all SearchBar tests**

Run:

```bash
npx vitest run src/components/search-bar.test.tsx
```

Expected: All tests PASS, including existing ones.

- [ ] **Step 9: Run full test suite**

Run:

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/search-bar.tsx src/components/search-bar.test.tsx
git commit -m "feat(search): integrate barcode scanner into SearchBar"
```

---

## Task 7: Final verification and PR

**Files:** None new — verification only

- [ ] **Step 1: Run full lint check**

Run:

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 2: Run full test suite with coverage**

Run:

```bash
npx vitest run --coverage
```

Expected: All tests pass. Coverage meets thresholds (lines >= 80%, branches >= 80%).

- [ ] **Step 3: Run TypeScript type check**

Run:

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Push branch and create PR**

```bash
git push origin HEAD
gh pr create --title "feat: add barcode scanner for EAN-13 medication lookup" --body "Adds camera-based EAN-13 barcode scanning to the SearchBar:
- BarcodeScannerButton component with accessibility support
- ScannerOverlay with live camera feed, focus trapping, and keyboard support
- useBarcodeScanner hook with QuaggaJS integration
- Detected barcodes auto-populate search input and submit through existing pipeline
- Graceful fallback on unsupported devices (scan button hidden)
- Full i18n support for Spanish locale"
```
