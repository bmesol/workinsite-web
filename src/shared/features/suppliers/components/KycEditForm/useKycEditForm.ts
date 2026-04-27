import { useKycValidate } from "../../../clients/components/KycValidate/KycValidate";
import type { KycEditFormProps } from "./DTOs";
import { useState } from "react";

const useKycEditForm = (
  props: KycEditFormProps,
  onClose: () => void
) => {
  const { supplierDetails, setSupplierDetails, selectedItem } = props;

  const kycType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, kycItems } = useKycValidate(input, kycType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedKycDetails = supplierDetails.kycDetails.map((item, index) =>
        index === selectedItem.id ? { kycType, value: input } : item
      );
      setSupplierDetails((prev) => ({
        ...prev,
        kycDetails: [...updatedKycDetails],
      }));
      onClose();
    }
  };

  return { kycType, kycItems, input, setInput, error, handleUpdate };
};

export { useKycEditForm };