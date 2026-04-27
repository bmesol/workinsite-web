import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { UpiIdField } from "@/shared/components/FormFields/UpiIdField";
import { UpiTypes } from "../../DTOs/SupplierProps";
import type { UpiInputFieldProps } from "./DTOs";

const UpiInputFields = (props: UpiInputFieldProps) => {
  const { upiType, input, setInput, error } = props;

  const labels = {[UpiTypes.GPAY]: "Enter Gpay number", [UpiTypes.PHONEPE]: "Enter Phonepe number", [UpiTypes.UPI_ID]: "Enter Upi id"};
  const Label = labels[upiType];

  const upiComponents = {[UpiTypes.GPAY]: PhoneNumberField, [UpiTypes.PHONEPE]: PhoneNumberField, [UpiTypes.UPI_ID]: UpiIdField};
  const UpiComponent = upiComponents[upiType];

  return (
    UpiComponent && (
      <UpiComponent inputValue={input} setInputValue={setInput} errorMessage={error[upiType.toLowerCase()]} placeholder={Label} />
    )
  );
};

export { UpiInputFields };
