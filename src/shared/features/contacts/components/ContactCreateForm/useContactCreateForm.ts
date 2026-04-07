import { useContactValidate } from "../ContactValidate/ContactValidate";
import type  { ContactListType } from "../../DTOs/ContactList";
import { ContactTypes } from "../../DTOs/ContactProps";
import { useCallback, useState } from "react";

const useContactCreateForm = (props: ContactListType, onClose?: () => void) => {
  const { contactList, setContactList } = props;

  const [contactType, setContactType] = useState<ContactTypes | "">("");
  const [input, setInput] = useState("");
  let { error, setError, initialError, validate, contactItems } = useContactValidate(input, contactType as ContactTypes);

  const getInputCount = (type: ContactTypes) =>
    contactList.contactDetails.filter((item) => item.value && item.contactType === type).length;
  contactItems = contactItems.filter((item) => getInputCount(item.value) !== 5);

  const handleSelectChange = useCallback(
    (value: ContactTypes) => {
      setContactType(value);
      setError(initialError);
      setInput("");
    },
    [setContactType, setError, initialError]
  );

  const handleAdd = () => {
    if (validate() && setContactList) {
      const newContactDetails = [
        ...contactList.contactDetails,
        { contactType: contactType as ContactTypes, value: input },
      ].sort((a, b) => {
        const order = [ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS];
        return order.indexOf(a.contactType) - order.indexOf(b.contactType);
      });
      setContactList((prev) => ({ ...prev, contactDetails: newContactDetails }));
      onClose?.();  
    }
  };

  return { contactType, contactItems, input, setInput, error, handleSelectChange, handleAdd };
};

export { useContactCreateForm };