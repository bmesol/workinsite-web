import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { StatusLegendDialog } from "@/shared/components/StatusLegendDialog/StatusLegendDialog";
import { SITE_STATUS_LIST } from "../../utils/siteStatus";

const SiteStatusLegend = () => {
  const { t } = useLanguage();
  return (
    <StatusLegendDialog
      title={t("Site Status")}
      ariaLabel={t("Site Status Info")}
      items={SITE_STATUS_LIST}
    />
  );
};

export { SiteStatusLegend };
