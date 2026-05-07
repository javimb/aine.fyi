import { getTranslations } from "next-intl/server";

export default async function AineExplainer() {
  const t = await getTranslations("explainer");

  return (
    <section className="mx-auto w-full max-w-2xl">
      <h2 className="text-xl font-bold tracking-tight">{t("heading")}</h2>
      <p className="mt-2 text-muted-foreground">{t("body")}</p>
    </section>
  );
}
