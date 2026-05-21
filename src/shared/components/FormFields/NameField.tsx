import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const NameField = (props: InputPropTypes) => {
  const {
    label,
    length = 75,
    errorMessage,
    placeholder,
    className,
    isDisabled,
    required = false,
    isHideLabel = false,
    regex = "^[a-zA-Z\\s]*$",
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.startsWith(" ")) return;
    if (regex && !new RegExp(regex).test(value)) return;
    if (value.length > length) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {!isHideLabel && (
        <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
          {label || "Name"}
          {required && (
            <span className="text-red-500 text-base leading-none">*</span>
          )}
        </Label>
      )}
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Enter name"}
        disabled={isDisabled}
        required={required}
        className="w-full"
      />
    </FormInput>
  );
};

export { NameField };
