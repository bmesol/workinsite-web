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
  required?: boolean;
  regex?: string;
};

export type SelectInputPropTypes = InputPropTypes & {
  items?: { label: string; value: string }[];
};