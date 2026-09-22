import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const GstNumberField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  return (
    <GenericInputField
      {...props}
      transform={(v) => v.toUpperCase()}
      filterRegex={/^[A-Z\d]*$/}
      hardMaxLength={15}
      defaultPlaceholder={t("Enter GST number")}
    />
  );
};

export { GstNumberField };
