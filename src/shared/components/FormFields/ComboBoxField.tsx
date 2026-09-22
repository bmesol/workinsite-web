import { SelectComboField } from "./SelectComboField";

type ComboboxFieldProps = {
  id: string;
  label: string;
  items: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (val: string) => void;
  onSearch: (val: string) => void;
  onCreate?: (val: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  listClassName?: string;
  className?: string;
};

const ComboboxField = ({
  disabled,
  error,
  onValueChange,
  onSearch,
  ...rest
}: ComboboxFieldProps) => (
  <SelectComboField
    {...rest}
    searchable
    isDisabled={disabled}
    errorMessage={error}
    onSearch={onSearch}
    onValueChange={(v) => onValueChange(String(v))}
  />
);

export { ComboboxField };
export type { ComboboxFieldProps };
