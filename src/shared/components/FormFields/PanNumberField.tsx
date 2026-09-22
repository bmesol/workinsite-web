import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const PanNumberField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  return (
    <GenericInputField
      {...props}
      transform={(v) => v.toUpperCase()}
      filterRegex={/^[A-Z\d]*$/}
      hardMaxLength={10}
      defaultPlaceholder={t("Enter PAN number")}
    />
  );
};

export { PanNumberField };
