import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const AadhaarNumberField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  return (
    <GenericInputField
      {...props}
      filterRegex={/^\d*$/}
      hardMaxLength={12}
      defaultPlaceholder={t("Enter Aadhaar number")}
    />
  );
};

export { AadhaarNumberField };
