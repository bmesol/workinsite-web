import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

export const PhoneNumberField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const { regex = "^\\d*$", length = 10 } = props;
  return (
    <GenericInputField
      {...props}
      length={length}
      label={props.label ?? t("Phone Number")}
      filterRegex={new RegExp(regex)}
      inputType="tel"
      defaultPlaceholder={t("Enter phone number")}
    />
  );
};
