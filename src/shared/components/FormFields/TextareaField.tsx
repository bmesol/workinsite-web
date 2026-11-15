import { FormInput } from "../FormInput/FormInput";
import { Textarea } from "@/shared/components/ui/textarea";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { FieldLabel } from "./FieldLabel";

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
    if (value.length > length) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {/* Label */}
      {!isHideLabel && label && (
        <FieldLabel required={required}>{label}</FieldLabel>
      )}

      {/* Textarea */}
      <Textarea
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        required={required}
        className="w-full text-sm disabled:opacity-75 disabled:bg-gray-100 dark:disabled:bg-neutral-800"
      />
    </FormInput>
  );
};

export { TextareaField };