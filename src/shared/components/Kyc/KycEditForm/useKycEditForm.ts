import { useKycValidate } from "../KycValidate/KycValidate";
import type { KycEditFormProps } from "./DTOs";
import { useState } from "react";

const useKycEditForm = (props: KycEditFormProps) => {
  const { details, setDetails, selectedItem, onClose } = props;

  const kycType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, kycItems } = useKycValidate(input, kycType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedKycDetails = details.kycDetails.map((item, index) =>
        index === selectedItem.id ? { kycType, value: input } : item
      );
      setDetails({ kycDetails: [...updatedKycDetails] });
      onClose?.();
    }
  };

  return { kycType, kycItems, input, setInput, error, handleUpdate };
};

export { useKycEditForm };