import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const GstNumberField = (props: InputPropTypes) => {
  const { label, errorMessage, isDisabled, placeholder, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z\d]*$/.test(value) && value.length <= 15) {
      handleInputChange(value);
    }
  };

  return (
    <FormInput errorMessage={errorMessage}>
      {label && (
        <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter GST number"}
        disabled={isDisabled}
        className="w-full"
      />
    </FormInput>
  );
};

export { GstNumberField };