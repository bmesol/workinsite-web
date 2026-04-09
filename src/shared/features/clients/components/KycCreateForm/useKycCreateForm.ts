import type { ClientDetailsType } from "../../DTOs/ClientDetails";
import { useKycValidate } from "../KycValidate/KycValidate";
import type { KYCTypes } from "../../DTOs/ClientProps";
import { useCallback, useState } from "react";

const useKycCreateForm = (props: ClientDetailsType & { onClose?: () => void }) => {
  const { clientDetails, setClientDetails, onClose } = props;

  const [kycType, setKycType] = useState<KYCTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, kycItems } = useKycValidate(input, kycType as KYCTypes);

  const getInputCount = (type: KYCTypes) => clientDetails.kycDetails.filter((item) => item.value && item.kycType === type).length;
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
      setClientDetails((prev) => ({ ...prev, kycDetails: [...prev.kycDetails, { kycType: kycType as KYCTypes, value: input }] }));
      onClose?.();
    }
  };

  return { kycType, kycItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useKycCreateForm };