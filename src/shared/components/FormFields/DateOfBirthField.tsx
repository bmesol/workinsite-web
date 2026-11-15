import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import { DatePicker } from "./DatePicker";

const DateOfBirthField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const {
    label,
    errorMessage,
    isDisabled,
    required = false,
    isHideLabel = false,
    className,
  } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  return (
    <DatePicker
      date={inputValue}
      onDateChange={handleInputChange}
      label={isHideLabel ? undefined : (label || t("Date of Birth"))}
      required={required}
      errorMessage={errorMessage}
      disable={isDisabled}
      minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
      className={className}
    />
  );
};

export { DateOfBirthField };
