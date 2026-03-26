import { FormInput } from "../FormInput/FormInput";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const TextareaField = (props: InputPropTypes) => {
  const {
    label,
    length = 1000,
    errorMessage,
    placeholder,
    className,
    isDisabled,
    required = false,
    isHideLabel,
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // length validate பண்ணு
    if (value.length > length) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {/* Label */}
      {!isHideLabel && label && (
        <Label className="mb-1 text-base">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Textarea */}
      <Textarea
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        required={required}
        className="w-full"
      />
    </FormInput>
  );
};

export { TextareaField };