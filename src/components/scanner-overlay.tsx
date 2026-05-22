"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannerOverlayProps {
  open: boolean;
  onClose: () => void;
  isScanning: boolean;
  lastDetected: string | null;
  error: string | null;
  startScanning: () => void;
  stopScanning: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScannerOverlay({
  open,
  onClose,
  isScanning,
  lastDetected,
  error,
  startScanning,
  stopScanning,
  containerRef,
}: ScannerOverlayProps) {
  const t = useTranslations("search");
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>canvas]:absolute [&>canvas]:left-0 [&>canvas]:top-0 [&>canvas]:h-full [&>canvas]:w-full"
      />

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

      <div className="z-10 flex flex-col items-center gap-4 p-4">
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
                {t("scannerRetryLabel")}
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
