"use client";

import { useTranslations } from "next-intl";
import WarningIcon from "@/components/warning-icon";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const t = useTranslations("errorState");

  return (
    <div role="alert" aria-live="polite" className="rounded-lg p-4 mt-4">
      <p className="text-status-red">
        <WarningIcon />
        {message}
      </p>
      <button onClick={onRetry}>{t("retry")}</button>
    </div>
  );
}
