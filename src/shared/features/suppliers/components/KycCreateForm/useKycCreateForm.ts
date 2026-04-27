import { useKycValidate } from "../../../clients/components/KycValidate/KycValidate";
import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { useCallback, useState } from "react";

const useKycCreateForm = (props: SupplierDetailsType & { onClose: () => void }) => { 
  const { supplierDetails, setSupplierDetails, onClose } = props;

  const [kycType, setKycType] = useState<KYCTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, kycItems } = useKycValidate(input, kycType as KYCTypes);

  const getInputCount = (type: KYCTypes) =>
    supplierDetails.kycDetails?.filter((item) => item.value && item.kycType === type).length ?? 0; 

  kycItems = kycItems.filter((item) => getInputCount(item.value) === 0);

  const handleSelectChange = useCallback(
    (value: KYCTypes) => {
      setKycType(value);
      setError(initialError);
      setInput("");
    }, [setKycType, setError, setInput, initialError]
  );

  const handleAdd = () => {
    if (validate()) {
      setSupplierDetails((prev) => ({
        ...prev,
        kycDetails: [...(prev.kycDetails ?? []), { kycType: kycType as KYCTypes, value: input }],
      }));
      onClose(); 
    }
  };

  return { kycType, kycItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useKycCreateForm };