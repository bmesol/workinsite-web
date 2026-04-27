import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const UpiIdField = (props: InputPropTypes) => {
  const { errorMessage, placeholder, className, isDisabled, required = false } = props;
  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[\w.\-@]*$/.test(value) || value === "") {
      handleInputChange(value);
    }
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter upi id"}
        disabled={isDisabled}
      />
    </FormInput>
  );
};

export { UpiIdField };