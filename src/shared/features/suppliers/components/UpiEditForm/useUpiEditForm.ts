import { useUpiValidate } from "../UpiValidate/UpiValidate";
import type { UpiEditFormProps } from "./DTOs";
import { useState } from "react";

const useUpiEditForm = (props: UpiEditFormProps & { onClose: () => void }) => { // 👈
  const { supplierDetails, setSupplierDetails, selectedItem, onClose } = props;

  const upiType = selectedItem.type;
  const [input, setInput] = useState(selectedItem.value);
  const { error, validate, upiItems } = useUpiValidate(input, upiType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedUpiDetails = supplierDetails.upiDetails?.map((item, index) => // 👈 null guard
        index === selectedItem.id ? { upiType, value: input } : item
      ) ?? [];
      setSupplierDetails((prev) => ({ ...prev, upiDetails: [...updatedUpiDetails] }));
      onClose(); // 👈 model.close() replace
    }
  };

  return { upiType, upiItems, input, setInput, error, handleUpdate };
};

export { useUpiEditForm };