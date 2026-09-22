import { FormInput } from "../FormInput/FormInput";
import { Input } from "@/shared/components/ui/input";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { FieldLabel } from "./FieldLabel";
import type { CSSProperties } from "react";

interface GenericInputFieldProps extends InputPropTypes {
  filterRegex?: RegExp;
  hardMaxLength?: number;
  transform?: (value: string) => string;
  inputType?: string;
  defaultPlaceholder?: string;
  noStartSpace?: boolean;
  inputStyle?: CSSProperties;
}

const GenericInputField = (props: GenericInputFieldProps) => {
  const {
    label,
    length,
    errorMessage,
    placeholder,
    className,
    inputClassName,
    isDisabled,
    required = false,
    isHideLabel = false,
    filterRegex,
    hardMaxLength,
    transform,
    inputType = "text",
    defaultPlaceholder,
    noStartSpace = false,
    inputStyle,
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  const maxLen = hardMaxLength ?? length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (transform) value = transform(value);
    if (noStartSpace && value.startsWith(" ")) return;
    if (filterRegex && value !== "" && !filterRegex.test(value)) return;
    if (maxLen !== undefined && value.length > maxLen) return;
    handleInputChange(value);
  };

  return (
    <FormInput errorMessage={errorMessage} className={className}>
      {!isHideLabel && label && (
        <FieldLabel required={required}>{label}</FieldLabel>
      )}
      <Input
        type={inputType}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder ?? defaultPlaceholder}
        disabled={isDisabled}
        maxLength={maxLen}
        className={`w-full ${inputClassName ?? ""}`}
        style={inputStyle}
      />
    </FormInput>
  );
};

export { GenericInputField };
export type { GenericInputFieldProps };
