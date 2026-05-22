"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

interface UseBarcodeScannerOptions {
  onDetected?: (code: string) => void;
}

interface UseBarcodeScannerReturn {
  isSupported: boolean;
  isScanning: boolean;
  lastDetected: string | null;
  error: string | null;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
}

const emptySubscribe = () => () => {};

function getIsSupportedSnapshot() {
  return (
    typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia
  );
}

function getServerSnapshot() {
  return false;
}

export function useBarcodeScanner(
  containerRef?: React.RefObject<HTMLDivElement | null>,
  options?: UseBarcodeScannerOptions,
): UseBarcodeScannerReturn {
  const isSupported = useSyncExternalStore(
    emptySubscribe,
    getIsSupportedSnapshot,
    getServerSnapshot,
  );

  const [isScanning, setIsScanning] = useState(false);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const quaggaRef = useRef<{
    stop: () => void;
    offDetected: () => void;
  } | null>(null);
  const lastDetectionTimeRef = useRef(0);
  const onDetectedRef = useRef(options?.onDetected);
  useEffect(() => {
    onDetectedRef.current = options?.onDetected;
  });

  const releaseTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    if (quaggaRef.current) {
      try {
        quaggaRef.current.stop();
      } catch {}
      quaggaRef.current = null;
    }
    const target = containerRef?.current ?? document.body;
    target.querySelectorAll("video, canvas").forEach((el) => el.remove());
    releaseTracks();
  }, [releaseTracks, containerRef]);

  const startScanning = useCallback(async () => {
    if (!isSupported) return;

    setError(null);
    setLastDetected(null);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
      navigator.userAgent,
    );
    const videoConstraints: MediaTrackConstraints = isMobile
      ? { facingMode: "environment" }
      : (true as unknown as MediaTrackConstraints);
    const constraints: MediaStreamConstraints = isMobile
      ? { video: { facingMode: "environment" } }
      : { video: true };

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch {
      setError("permission_denied");
      return;
    }

    streamRef.current = stream;

    try {
      const Quagga = (await import("@ericblade/quagga2")).default;
      quaggaRef.current = Quagga;

      const target = containerRef?.current ?? document.body;
      await new Promise<void>((resolve, reject) => {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target,
              constraints: videoConstraints,
            },
            decoder: {
              readers: ["ean_reader"],
            },
            locate: true,
            frequency: 10,
          },
          (err?: unknown) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });

      Quagga.start();
      setIsScanning(true);

      Quagga.onDetected((result: { codeResult: { code: string | null } }) => {
        const code = result.codeResult.code;
        if (!code || !/^\d{13}$/.test(code)) return;

        const now = Date.now();
        if (
          lastDetectionTimeRef.current > 0 &&
          now - lastDetectionTimeRef.current < 2000
        )
          return;
        lastDetectionTimeRef.current = now;

        setLastDetected(code);
        onDetectedRef.current?.(code);
        stopScanning();
      });
    } catch {
      setError("permission_denied");
      releaseTracks();
    }
  }, [isSupported, stopScanning, releaseTracks, containerRef]);

  useEffect(() => {
    return () => {
      releaseTracks();
    };
  }, [releaseTracks]);

  return {
    isSupported,
    isScanning,
    lastDetected,
    error,
    startScanning,
    stopScanning,
  };
}
