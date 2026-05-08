import { getTranslations } from "next-intl/server";
import { lastUpdated } from "../../data/aine-classification";

export default async function DataSource() {
  const t = await getTranslations("dataSource");

  return (
    <p className="text-sm text-muted-foreground">
      {t("attribution", { date: lastUpdated })}
    </p>
  );
}
