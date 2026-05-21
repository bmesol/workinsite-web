import { AadhaarNumberField } from "@/shared/components/FormFields/AadhaarNumberField";
import { PanNumberField } from "@/shared/components/FormFields/PanNumberField";
import { GstNumberField } from "@/shared/components/FormFields/GstNumberField";
import { KYCTypes } from "../DTOs/DTOs";
import type { KycInputFieldProps } from "./DTOs";

const KycInputFields = (props: KycInputFieldProps) => {
  const { kycType, input, setInput, error } = props;

  const kycComponents = {[KYCTypes.AADHAAR]: AadhaarNumberField, [KYCTypes.PAN]: PanNumberField, [KYCTypes.GST]: GstNumberField };
  const KycComponent = kycComponents[kycType];

  return KycComponent && (<KycComponent inputValue={input} setInputValue={setInput} errorMessage={error[kycType.toLowerCase()]} />
  );
};

export { KycInputFields };
