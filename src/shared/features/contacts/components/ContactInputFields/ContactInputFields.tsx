import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { EmailField } from "@/shared/components/FormFields/EmailField";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactInputFieldProps } from "./DTOs";

const ContactInputFields = (props: ContactInputFieldProps) => {
  const { contactType, input, setInput, error } = props;

  const contactField = {
    [ContactTypes.PHONE]: <PhoneNumberField inputValue={input} setInputValue={setInput} errorMessage={error.phone} placeholder="Phone" />,
    [ContactTypes.EMAIL]: <EmailField inputValue={input} setInputValue={setInput} errorMessage={error.email} placeholder="Email" />,
    [ContactTypes.ADDRESS]: <TextareaField length={300} inputValue={input} setInputValue={setInput} errorMessage={error.address} placeholder="Address" />,
  };

  return contactField[contactType] || <></>;
};

export { ContactInputFields };
