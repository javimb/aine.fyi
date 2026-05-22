"use client";

import { useTranslations } from "next-intl";
import { ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerButtonProps {
  isSupported: boolean;
  onOpenScanner: () => void;
}

export default function BarcodeScannerButton({
  isSupported,
  onOpenScanner,
}: BarcodeScannerButtonProps) {
  const t = useTranslations("search");

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-12 w-12"
      aria-label={t("scanButtonLabel")}
      onClick={onOpenScanner}
    >
      <ScanBarcode className="size-5" />
    </Button>
  );
}
