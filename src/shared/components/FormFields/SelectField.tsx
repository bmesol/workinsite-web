import { SelectComboField } from "./SelectComboField";

type SelectItem = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label?: string;
  items: SelectItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
};

const SelectField = (props: SelectFieldProps) => (
  <SelectComboField {...props} searchable={false} />
);

export { SelectField };
export type { SelectFieldProps };
