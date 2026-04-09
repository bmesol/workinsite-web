import { KYCTypes } from "../../DTOs/ClientProps";
import { useState } from "react";

const useKycValidate = (input: string, KycType: KYCTypes) => {
  const initialError = { aadhaar: "", pan: "", gst: "", select: "" };
  const [error, setError] = useState(initialError);

  const kycItems = [{ label: "Aadhaar", value: KYCTypes.AADHAAR }, { label: "PAN", value: KYCTypes.PAN }, { label: "GST", value: KYCTypes.GST }];

  const validate = () => {
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    switch (KycType) {
      case KYCTypes.AADHAAR:
        if (!input) updateError("aadhaar", "Please enter Aadhaar number");
        else if (input.length < 12) updateError("aadhaar", "Invalid Aadhaar number");
        break;

      case KYCTypes.PAN:
        if (!input) updateError("pan", "Please enter PAN number");
        else if (!/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(input)) updateError("pan", "Invalid PAN number");
        break;

      case KYCTypes.GST:
        if (!input) updateError("gst", "Please enter GST number");
        else if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(input)) updateError("gst", "Invalid GST number");
        break;

      default:
        setError((prev) => ({ ...prev, select: "Select KYC type" }));
        isValid = false;
        break;
    }

    return isValid;
  };

  return { error, setError, initialError, validate, kycItems };
};

export { useKycValidate };
