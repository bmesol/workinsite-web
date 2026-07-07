import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { UpiIdField } from "@/shared/components/FormFields/UpiIdField";
import { UpiTypes } from "../DTOs/DTOs";
import type { UpiInputFieldProps } from "./DTOs";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const UpiInputFields = (props: UpiInputFieldProps) => {
  const { t } = useLanguage();
  const { upiType, input, setInput, error } = props;

  const labels = {[UpiTypes.GPAY]: t('Enter Gpay number'), [UpiTypes.PHONEPE]: t('Enter Phonepe number'), [UpiTypes.UPI_ID]: t('Enter Upi ID')};
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
