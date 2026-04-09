import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

export const PhoneNumberField = (props: InputPropTypes) => {
  const {
    label,
    length = 10,
    errorMessage,
    placeholder,
    className,
    isDisabled,
    required = false,
    isHideLabel,
    regex = "^\\d*$",
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // regex validation
    if (regex && !new RegExp(regex).test(value)) return;
    if (value.length > length) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {/* Label */}
      {!isHideLabel && (
        <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
          {label || "Phone Number"}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {/* Input */}
      <Input
        type="tel"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter phone number"}
        disabled={isDisabled}
        required={required}
        className="w-full"
      />
    </FormInput>
  );
};
