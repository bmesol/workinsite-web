import { useCallback, useState } from "react";
import { useKycValidate } from "../KycValidate/KycValidate";
import { KYCTypes } from "../DTOs/DTOs";
import type { KycTypesProps } from "../DTOs/DTOs";

interface KycFormProps extends KycTypesProps {
  mode: "create" | "edit";
  selectedItem?: { id: number; type: KYCTypes; value: string };
}

const useKycForm = (props: KycFormProps) => {
  const { details, setDetails, onClose, mode, selectedItem } = props;

  const [kycType, setKycType] = useState<KYCTypes | "">(
    mode === "edit" ? selectedItem!.type : ""
  );
  const [input, setInput] = useState(mode === "edit" ? selectedItem!.value : "");

  let { error, setError, initialError, validate, kycItems } = useKycValidate(
    input,
    kycType as KYCTypes
  );

  if (mode === "create") {
    const getInputCount = (type: KYCTypes) =>
      details.kycDetails.filter((item) => item.value && item.kycType === type).length;
    kycItems = kycItems.filter((item) => getInputCount(item.value) === 0);
  }

  const handleSelectChange = useCallback(
    (value: KYCTypes) => {
      setKycType(value);
      setError(initialError);
      setInput("");
    },
    [setKycType, setError, setInput, initialError]
  );

  const handleSave = () => {
    if (!validate()) return;

    if (mode === "create") {
      setDetails({
        kycDetails: [
          ...details.kycDetails,
          { kycType: kycType as KYCTypes, value: input },
        ],
      });
    } else {
      const updated = details.kycDetails.map((item, index) =>
        index === selectedItem!.id ? { kycType: kycType as KYCTypes, value: input } : item
      );
      setDetails({ kycDetails: [...updated] });
    }

    onClose?.();
  };

  return { kycType, kycItems, input, setInput, error, handleSelectChange, handleSave };
};

export { useKycForm };
export type { KycFormProps };
