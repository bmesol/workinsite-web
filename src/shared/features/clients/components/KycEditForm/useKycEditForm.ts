import { useKycValidate } from "../KycValidate/KycValidate";
import type { ClientEditFormProps } from "./DTOs";
import { useState } from "react";

const useKycEditForm = (props: ClientEditFormProps, onClose: () => void) => {
  const { clientDetails, setClientDetails, selectedItem } = props;

  const kycType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, kycItems } = useKycValidate(input, kycType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedKycDetails = clientDetails.kycDetails.map((item, index) =>
        index === selectedItem.id ? { kycType, value: input } : item
      );
      setClientDetails((prev) => ({ ...prev, kycDetails: [...updatedKycDetails] }));
      onClose(); // 👈 replaces model.close()
    }
  };

  return { kycType, kycItems, input, setInput, error, handleUpdate };
};

export { useKycEditForm };