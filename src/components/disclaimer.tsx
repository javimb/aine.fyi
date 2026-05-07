import { getTranslations } from "next-intl/server";

export default async function Disclaimer() {
  const t = await getTranslations("disclaimer");

  return (
    <div
      role="note"
      className="mx-auto w-full max-w-2xl rounded-lg border border-callout-border bg-callout-bg p-4"
    >
      <p className="text-sm font-semibold text-callout">{t("heading")}</p>
      <p className="mt-1 text-sm text-foreground">{t("body")}</p>
    </div>
  );
}
