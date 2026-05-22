import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

describe("useBarcodeScanner", () => {
  let mockQuagga: {
    init: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    offDetected: ReturnType<typeof vi.fn>;
    onDetected: ReturnType<typeof vi.fn>;
  };
  let originalMediaDevices: PropertyDescriptor | undefined;

  beforeEach(() => {
    vi.resetModules();
    mockQuagga = {
      init: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      offDetected: vi.fn(),
      onDetected: vi.fn(),
    };

    originalMediaDevices = Object.getOwnPropertyDescriptor(
      navigator,
      "mediaDevices",
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalMediaDevices) {
      Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
    } else {
      delete (navigator as unknown as Record<string, unknown>).mediaDevices;
    }
  });

  function mockGetUserMedia(resolution: "resolve" | "reject" = "resolve") {
    const trackStopSpy = vi.fn();
    const stream = {
      getTracks: () => [{ stop: trackStopSpy } as unknown as MediaStreamTrack],
      getVideoTracks: () =>
        [{ stop: trackStopSpy }] as unknown as MediaStreamTrack[],
    };

    const getUserMedia =
      resolution === "resolve"
        ? vi.fn().mockResolvedValue(stream)
        : vi
            .fn()
            .mockRejectedValue(
              new DOMException("Permission denied", "NotAllowedError"),
            );

    Object.defineProperty(navigator, "mediaDevices", {
      value: { getUserMedia },
      writable: true,
      configurable: true,
    });

    return { stream, getUserMedia, trackStopSpy };
  }

  function mockNoGetUserMedia() {
    Object.defineProperty(navigator, "mediaDevices", {
      value: undefined,
      writable: true,
      configurable: true,
    });
  }

  async function setupQuaggaMock() {
    vi.doMock("@ericblade/quagga2", () => ({
      default: mockQuagga,
    }));

    mockQuagga.init.mockImplementation(
      (_config: unknown, callback: (err?: unknown) => void) => {
        callback();
      },
    );

    const { useBarcodeScanner } = await import("./use-barcode-scanner");
    return renderHook(() => useBarcodeScanner());
  }

  it("returns isSupported=false when getUserMedia is unavailable", async () => {
    mockNoGetUserMedia();

    vi.doMock("@ericblade/quagga2", () => ({
      default: mockQuagga,
    }));

    const { useBarcodeScanner } = await import("./use-barcode-scanner");
    const { result } = renderHook(() => useBarcodeScanner());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(false);
    });
  });

  it("sets isScanning=true after startScanning succeeds", async () => {
    mockGetUserMedia("resolve");

    const { result } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    expect(result.current.isScanning).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("sets lastDetected on valid 13-digit barcode and stops scanning", async () => {
    mockGetUserMedia("resolve");

    const { result } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];
    await act(async () => {
      onDetectedCb({ codeResult: { code: "8470006543215" } });
    });

    expect(result.current.lastDetected).toBe("8470006543215");
    expect(result.current.isScanning).toBe(false);
  });

  it("ignores detection of non-13-digit codes", async () => {
    mockGetUserMedia("resolve");

    const { result } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    const onDetectedCb = mockQuagga.onDetected.mock.calls[0][0];
    await act(async () => {
      onDetectedCb({ codeResult: { code: "12345" } });
    });

    expect(result.current.lastDetected).toBeNull();
  });

  it("debounces detections within 2 seconds", async () => {
    let currentTime = 1000000;
    vi.spyOn(Date, "now").mockImplementation(() => currentTime);

    mockGetUserMedia("resolve");

    const { result } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    const firstOnDetectedCb = mockQuagga.onDetected.mock.calls[0][0];

    await act(async () => {
      firstOnDetectedCb({ codeResult: { code: "8470006543215" } });
    });

    expect(result.current.lastDetected).toBe("8470006543215");
    expect(result.current.isScanning).toBe(false);

    await act(async () => {
      await result.current.startScanning();
    });

    expect(result.current.lastDetected).toBeNull();

    currentTime += 500;

    const secondOnDetectedCb =
      mockQuagga.onDetected.mock.calls[
        mockQuagga.onDetected.mock.calls.length - 1
      ][0];
    await act(async () => {
      secondOnDetectedCb({ codeResult: { code: "8470009999999" } });
    });

    expect(result.current.lastDetected).toBeNull();
  });

  it("sets error state when camera permission is denied", async () => {
    mockGetUserMedia("reject");

    vi.doMock("@ericblade/quagga2", () => ({
      default: mockQuagga,
    }));

    const { useBarcodeScanner } = await import("./use-barcode-scanner");
    const { result } = renderHook(() => useBarcodeScanner());

    await act(async () => {
      await result.current.startScanning();
    });

    expect(result.current.error).toBe("permission_denied");
    expect(result.current.isScanning).toBe(false);
  });

  it("stops QuaggaJS and releases camera tracks on stopScanning", async () => {
    const { trackStopSpy } = mockGetUserMedia("resolve");

    const { result } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    act(() => {
      result.current.stopScanning();
    });

    expect(mockQuagga.stop).toHaveBeenCalled();
    expect(trackStopSpy).toHaveBeenCalled();
    expect(result.current.isScanning).toBe(false);
  });

  it("stops camera tracks on unmount", async () => {
    const { trackStopSpy } = mockGetUserMedia("resolve");

    const { result, unmount } = await setupQuaggaMock();

    await act(async () => {
      await result.current.startScanning();
    });

    unmount();

    expect(trackStopSpy).toHaveBeenCalled();
  });
});
