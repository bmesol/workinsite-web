import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { FormInput } from "../FormInput/FormInput";
import type { InputPropTypes } from "./InputPropTypes";
import { useInputField } from "./useInputField";

const RadioField = (props: InputPropTypes) => {
  const {
    label,
    errorMessage,
    isDisabled,
    items = [],
    required = false,
  } = props;

  const { inputValue, handleInputChange } = useInputField(props);

  return (
    <FormInput errorMessage={errorMessage}>
      {/* Label */}
      {label && (
        <p className="mb-2 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}

      {/* Radio Group */}
      <RadioGroup
        value={String(inputValue)}
        onValueChange={handleInputChange}
        className="flex flex-row gap-4"
      >
        {items.map((item: any) => (
          <div key={item.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={String(item.value)}
              id={String(item.value)}
              disabled={isDisabled}
            />
            <Label htmlFor={String(item.value)}>
              {item.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormInput>
  );
};

export { RadioField };