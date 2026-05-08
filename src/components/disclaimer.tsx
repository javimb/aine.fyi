import { getTranslations } from "next-intl/server";
import WarningIcon from "@/components/warning-icon";

export default async function Disclaimer() {
  const t = await getTranslations("disclaimer");

  return (
    <div
      role="note"
      className="mx-auto w-full max-w-2xl rounded-lg border border-callout-border bg-callout-bg p-4"
    >
      <p className="text-sm font-semibold text-callout">
        <span className="flex items-start gap-1">
          <WarningIcon />
          {t("heading")}
        </span>
      </p>
      <p className="mt-1 text-sm text-foreground">{t("body")}</p>
    </div>
  );
}
