import { useUpiValidate } from "../UpiValidate/UpiValidate";
import type { UpiEditFormProps } from "../DTOs/DTOs";
import { useState } from "react";

const useUpiEditForm = (props: UpiEditFormProps) => {
  const { details, setDetails, selectedItem, onClose } = props;

  const upiType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, upiItems } = useUpiValidate(input, upiType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedUpiDetails = details.upiDetails?.map((item, index) =>
        index === selectedItem.id ? { upiType, value: input } : item
      ) ?? [];
      setDetails({ upiDetails: [...updatedUpiDetails] });
      onClose?.();
    }
  };

  return { upiType, upiItems, input, setInput, error, handleUpdate };
};

export { useUpiEditForm };