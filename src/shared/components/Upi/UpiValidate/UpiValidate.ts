import { UpiTypes } from "../DTOs/DTOs";
import { useState } from "react";

const useUpiValidate = (input: string, UpiType: UpiTypes) => {
  const initialError = { gpay: "", phonepe: "", upi_id: "", select: "" };
  const [error, setError] = useState(initialError);

  const upiItems = [{ label: "GPAY", value: UpiTypes.GPAY }, { label: "PHONEPE", value: UpiTypes.PHONEPE }, { label: "UPI ID", value: UpiTypes.UPI_ID }];

  const validate = () => {
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    switch (UpiType) {
      case UpiTypes.GPAY:
        if (!input) updateError("gpay", "Please enter Gpay number");
        else if (input.length < 10) updateError("gpay", "Invalid Gpay number");
        break;

      case UpiTypes.PHONEPE:
        if (!input) updateError("phonepe", "Please enter Phonepe number");
        else if (input.length < 10) updateError("phonepe", "Invalid Phonepe number");
        break;

      case UpiTypes.UPI_ID:
        if (!input) updateError("upi_id", "Please enter Upi id");
        else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(input)) updateError("upi_id", "Invalid Upi id");
        break;

      default:
        setError((prev) => ({ ...prev, select: "Select Upi type" }));
        isValid = false;
        break;
    }

    return isValid;
  };

  return { error, setError, initialError, validate, upiItems };
};

export { useUpiValidate };
