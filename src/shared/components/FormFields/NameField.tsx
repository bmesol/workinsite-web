import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const NameField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const { regex = "^[a-zA-Z0-9.\\s]*$", length = 75 } = props;
  return (
    <GenericInputField
      {...props}
      length={length}
      label={props.label ?? t("Name")}
      filterRegex={new RegExp(regex)}
      noStartSpace
      defaultPlaceholder={t("Enter name")}
      inputClassName={`disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-neutral-800 ${props.inputClassName ?? ""}`}
      inputStyle={{ fontFamily: "Outfit, sans-serif", fontSize: "var(--font-sm)" }}
    />
  );
};

export { NameField };
