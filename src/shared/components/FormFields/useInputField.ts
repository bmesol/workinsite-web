import type { InputPropTypes } from "./InputPropTypes";

const useInputField = (props: InputPropTypes) => {
  const { inputValue, setInputValue } = props;

  const handleInputChange = (value: string) => {
    setInputValue(value); 
  };

  return { inputValue, handleInputChange };
};

export { useInputField };