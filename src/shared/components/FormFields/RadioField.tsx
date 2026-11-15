import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { FormInput } from "../FormInput/FormInput";
import type { SelectInputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";
import { cn } from "@/shared/components/lib/utils";
import { FieldLabel } from "./FieldLabel";

const RadioField = (props: SelectInputPropTypes) => {
  const {
    label,
    errorMessage,
    isDisabled,
    items = [],
    required = false,
    className,
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  return (
    <FormInput errorMessage={errorMessage}>
      {/* Label */}
      {label && (
        <FieldLabel required={required}>{label}</FieldLabel>
      )}

      {/* Radio Group */}
      <RadioGroup
        value={String(inputValue)}
        onValueChange={handleInputChange}
        aria-label={label}
        className={cn("flex flex-row gap-4", className)}
      >
        {items.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={String(item.value)}
              id={String(item.value)}
              disabled={isDisabled}
            />
            <Label htmlFor={String(item.value)}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FormInput>
  );
};

export { RadioField };
