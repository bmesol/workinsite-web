import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const EmailField = (props: InputPropTypes) => {
  const { label, errorMessage, placeholder, className, isDisabled, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (/^[a-z0-9@.\-\_]*$/.test(value) || value === "") {
    handleInputChange(value); 
  }
};

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {label && (
        <Label className="mb-1">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        type="email"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter email"}
        disabled={isDisabled}
        required={required}
        maxLength={50}
        className="w-full"
      />
    </FormInput>
  );
};

export { EmailField };