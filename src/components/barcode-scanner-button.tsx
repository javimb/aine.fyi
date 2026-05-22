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
