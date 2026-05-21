import type { UpiTypesProps } from "../DTOs/DTOs";
import { UpiTypes } from "../DTOs/DTOs";
import { useUpiValidate } from "../UpiValidate/UpiValidate";
import { useCallback, useState } from "react";

const useUpiCreateForm = (props: UpiTypesProps) => {
  const { details, setDetails, onClose } = props;

  const [upiType, setUpiType] = useState<UpiTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, upiItems } = useUpiValidate(input, upiType as UpiTypes);

  const getInputCount = (type: UpiTypes) =>
    details.upiDetails.filter((item) => item.value && item.upiType === type).length;

  upiItems = upiItems.filter((item) => getInputCount(item.value) === 0);

  const handleSelectChange = useCallback(
    (value: UpiTypes) => {
      setUpiType(value);
      setError(initialError);
      setInput("");
    },
    [setUpiType, setError, setInput, initialError]
  );

  const handleAdd = () => {
    if (validate()) {
      setDetails({
        upiDetails: [...details.upiDetails, { upiType: upiType as UpiTypes, value: input }],
      });
      onClose?.();
    }
  };

  return { upiType, upiItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useUpiCreateForm };