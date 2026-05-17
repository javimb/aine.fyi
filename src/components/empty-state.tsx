"use client";

import { useTranslations } from "next-intl";

interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  const t = useTranslations("emptyState");

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg bg-muted p-4 mt-4"
    >
      <h3>{t("title", { query })}</h3>
      <div>
        <p>{t("tipHeading")}</p>
        <ul>
          <li>{t("tipSpelling")}</li>
          <li>{t("tipGeneric")}</li>
          <li>{t("tipBrand")}</li>
        </ul>
      </div>
    </div>
  );
}
