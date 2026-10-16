import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { StatusLegendDialog } from "@/shared/components/StatusLegendDialog/StatusLegendDialog";
import { USER_STATUS_LIST } from "../../utils/userStatus";

const UserStatusLegend = () => {
  const { t } = useLanguage();
  return (
    <StatusLegendDialog
      title={t("User Status")}
      ariaLabel={t("User Status Info")}
      items={USER_STATUS_LIST}
    />
  );
};

export { UserStatusLegend };
