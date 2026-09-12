interface GoogleLocationProps {
  errorMessage?: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  classNames?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export type { GoogleLocationProps };