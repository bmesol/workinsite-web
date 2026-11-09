import { SelectComboField } from "./SelectComboField";

type ComboboxItem<T = unknown> = { label: string; value: string; allItems?: T };

type ComboboxFieldProps<T = unknown> = {
  id: string;
  label: string;
  items: ComboboxItem<T>[];
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

const ComboboxField = <T = unknown>({
  disabled,
  error,
  onValueChange,
  onSearch,
  ...rest
}: ComboboxFieldProps<T>) => (
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
export type { ComboboxFieldProps, ComboboxItem };
