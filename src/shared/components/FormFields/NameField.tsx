import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const NameField = (props: InputPropTypes) => {
  const { t } = useLanguage();
  const {
    label,
    length = 75,
    errorMessage,
    placeholder,
    className,
    inputClassName,
    isDisabled,
    required = false,
    isHideLabel = false,
    regex = "^[a-zA-Z0-9.\\s]*$",
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.startsWith(" ")) return;
    if (regex && value !== "" && !new RegExp(regex).test(value)) return; 
    if (value.length > length) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {!isHideLabel && (
        <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
          {label || t("Name")}
          {required && (
            <span className="text-red-500 text-base leading-none">*</span>
          )}
        </Label>
      )}
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || t("Enter name")}
        disabled={isDisabled}
        className={`w-full disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-neutral-800 ${inputClassName ?? ""}`}
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "var(--font-sm)",
        }}
      />
    </FormInput>
  );
};

export { NameField };
