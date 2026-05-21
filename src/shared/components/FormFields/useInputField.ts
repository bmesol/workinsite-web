import type { InputPropTypes } from "./InputPropTypes";

const useInputField = (props: InputPropTypes) => {
  const { inputValue, setInputValue } = props;

  const handleInputChange = (value: string) => {
    setInputValue(value); 
  };

  return { inputValue, handleInputChange };
};

export { useInputField };

// import type { InputPropTypes } from "./InputPropTypes";

// const useInputField = (props: InputPropTypes) => {
//   const { inputValue, setInputValue } = props;

//   // HTML input onChange-க்கு
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   // RadioGroup, Select onValueChange-க்கு
//   const handleValueChange = (value: string) => {
//     setInputValue(value);
//   };

//   return { inputValue, handleInputChange, handleValueChange };
// };

// export { useInputField };