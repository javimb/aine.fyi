"use client";

import { useTranslations } from "next-intl";

export default function EmptyResults() {
  const t = useTranslations("search");

  return (
    <p role="status" aria-live="polite" className="mt-4 text-muted-foreground">
      {t("emptyResults")}
    </p>
  );
}
