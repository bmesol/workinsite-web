import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { useUpiValidate } from "../UpiValidate/UpiValidate";
import { UpiTypes } from "../../DTOs/SupplierProps";
import { useCallback, useState } from "react";

const useUpiCreateForm = (
  props: SupplierDetailsType & { onClose?: () => void }
) => {
  const { supplierDetails, setSupplierDetails, onClose } = props;

  const [upiType, setUpiType] = useState<UpiTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, upiItems } = useUpiValidate(
    input,
    upiType as UpiTypes
  );

  const getInputCount = (type: UpiTypes) =>
    supplierDetails.upiDetails.filter(
      (item) => item.value && item.upiType === type
    ).length;

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
      setSupplierDetails((prev) => ({
        ...prev,
        upiDetails: [
          ...prev.upiDetails,
          { upiType: upiType as UpiTypes, value: input },
        ],
      }));
      onClose?.();
    }
  };

  return { upiType, upiItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useUpiCreateForm };