import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const AadhaarNumberField = (props: InputPropTypes) => {
  const { label, errorMessage, placeholder, className, isDisabled, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (/^\d*$/.test(value) && value.length <= 12) {
    handleInputChange(value);
  }
};

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter Aadhaar number"}
        disabled={isDisabled}
        className="w-full"
      />
    </FormInput>
  );
};

export { AadhaarNumberField };