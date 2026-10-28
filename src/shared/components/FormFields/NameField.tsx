import { GenericInputField } from "./GenericInputField";
import type { InputPropTypes } from "./InputPropTypes";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { NAME_REGEX, NAME_MAX_LENGTH } from "@/shared/utils/nameValidation";

const NameField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const { regex, length = NAME_MAX_LENGTH } = props;
  return (
    <GenericInputField
      {...props}
      length={length}
      label={props.label ?? t("Name")}
      filterRegex={regex ? new RegExp(regex) : NAME_REGEX}
      noStartSpace
      defaultPlaceholder={t("Enter name")}
      inputClassName={`disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-neutral-800 ${props.inputClassName ?? ""}`}
      inputStyle={{ fontFamily: "Outfit, sans-serif", fontSize: "var(--font-sm)" }}
    />
  );
};

export { NameField };
