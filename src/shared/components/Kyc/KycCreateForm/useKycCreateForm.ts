import { useKycValidate } from "../KycValidate/KycValidate";
import { useCallback, useState } from "react";
import type { KycTypesProps } from "../DTOs/DTOs";
import { KYCTypes } from "../DTOs/DTOs";

const useKycCreateForm = (props: KycTypesProps) => {
  const { details, setDetails, onClose } = props;

  const [kycType, setKycType] = useState<KYCTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, kycItems } = useKycValidate(input, kycType as KYCTypes);

  const getInputCount = (type: KYCTypes) =>
    details.kycDetails.filter((item) => item.value && item.kycType === type).length;

  kycItems = kycItems.filter((item) => getInputCount(item.value) === 0);

  const handleSelectChange = useCallback(
    (value: KYCTypes) => {
      setKycType(value);
      setError(initialError);
      setInput("");
    },
    [setKycType, setError, setInput, initialError]
  );

  const handleAdd = () => {
    if (validate()) {
    setDetails({
  kycDetails: [...details.kycDetails, { kycType: kycType as KYCTypes, value: input }],
});
      onClose?.();
    }
  };

  return { kycType, kycItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useKycCreateForm };