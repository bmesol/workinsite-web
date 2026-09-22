import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const IfscCodeField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const { length = 11 } = props;
  return (
    <GenericInputField
      {...props}
      length={length}
      transform={(v) => v.toUpperCase()}
      filterRegex={/^[A-Z0-9]*$/}
      defaultPlaceholder={t("IFSC Code")}
    />
  );
};

export { IfscCodeField };
