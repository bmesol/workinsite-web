import { FormInput } from "../FormInput/FormInput";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

const DateOfBirthField = (props: InputPropTypes) => {
  const { t } = useLanguage()
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
        <label className="text-base font-semibold mb-1">
          {label || t("Date of Birth")}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder || "DD/MM/YYYY"}
        maxLength={length}
        disabled={isDisabled}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </FormInput>
  );
};

export { DateOfBirthField };