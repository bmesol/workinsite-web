import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const UpiIdField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  return (
    <GenericInputField
      {...props}
      filterRegex={/^[\w.\-@]*$/}
      defaultPlaceholder={t("Enter Upi ID")}
    />
  );
};

export { UpiIdField };
