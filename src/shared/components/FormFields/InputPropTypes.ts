export type InputPropTypes = {
  label?: string;
  length?: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  inputClassName?: string;
  isHideLabel?: boolean;
  items?: { label: string; value: string }[];
  required?: boolean;
  regex?: string;
}