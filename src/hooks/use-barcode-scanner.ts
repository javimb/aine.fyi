"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
    typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  const [isScanning, setIsScanning] = useState(false);
  const [lastDetected, setLastDetected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const quaggaRef = useRef<{
    stop: () => void;
    offDetected: () => void;
  } | null>(null);
  const lastDetectionTimeRef = useRef(0);

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
    releaseTracks();
  }, [releaseTracks]);

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

      await new Promise<void>((resolve, reject) => {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: document.body,
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
        stopScanning();
      });
    } catch {
      setError("permission_denied");
      releaseTracks();
    }
  }, [isSupported, stopScanning, releaseTracks]);

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
