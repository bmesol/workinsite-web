import { FormInput } from '../FormInput/FormInput';
import { Input } from "@/shared/components/ui/input";
import type { InputPropTypes } from './InputPropTypes';
import { useInputField } from './useInputField';

const IfscCodeField = (props: InputPropTypes) => {
  const { label, length = 11, errorMessage, placeholder, className, isDisabled, required = false } = props; // 👈 classNames → className
  const { inputValue, handleInputChange } = useInputField(props);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(value) || value === "") {
      handleInputChange(value);
    }
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}> 
      <Input
        value={inputValue}
        onChange={handleChange}
        maxLength={length}
        placeholder={placeholder || "IFSC code"}
        disabled={isDisabled}
      />
    </FormInput>
  );
};

export { IfscCodeField };