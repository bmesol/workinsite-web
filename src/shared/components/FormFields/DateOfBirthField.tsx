import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { FieldLabel } from "./FieldLabel";

const DateOfBirthField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const {
    label,
    placeholder,
    isHideLabel = false,
    errorMessage,
    isDisabled,
    length = 10,
    required = false,
  } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  return (
    <FormInput errorMessage={errorMessage}>
      {!isHideLabel && (
        <FieldLabel required={required}>
          {label || t("Date of Birth")}
        </FieldLabel>
      )}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder || "DD/MM/YYYY"}
        maxLength={length}
        disabled={isDisabled}
        className="w-full"
      />
    </FormInput>
  );
};

export { DateOfBirthField };
