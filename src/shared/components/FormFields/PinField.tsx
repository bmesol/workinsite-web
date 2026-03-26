import { FormInput } from "../FormInput/FormInput";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const PinField = (props: InputPropTypes) => {
  const { label, errorMessage, className, isDisabled, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      <Label className="mb-1">
        {label || "Pin"}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="password"
        maxLength={4}
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*$/.test(val) && val.length <= 4) {
            handleInputChange(val);
          }
        }}
        disabled={isDisabled}
        required={required}
        placeholder="••••"
        className="w-full tracking-widest text-center text-lg"
      />
    </FormInput>
  );
};

export { PinField };