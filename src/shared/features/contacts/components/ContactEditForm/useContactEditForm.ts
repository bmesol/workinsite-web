import { useContactValidate } from "../ContactValidate/ContactValidate";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactEditFormProps } from "./DTOs";
import { useState } from "react";

const useContactEditForm = (props: ContactEditFormProps, onClose?: () => void) => {
  
  const { contactList, setContactList, selectedItem } = props;

  const [isOpen, setIsOpen] = useState(false);
  const model = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  const contactType = selectedItem.type;
  
  const [input, setInput] = useState(selectedItem.value);
  let { error, validate, contactItems } = useContactValidate(input, contactType);

  const handleUpdate = () => {
    if (validate()) {
      const updatedContactDetails = contactList.contactDetails
        .map((item, index) =>
          index === selectedItem.id ? { contactType, value: input } : item
        )
        .sort((a, b) => {
          const order = [ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS];
          return order.indexOf(a.contactType) - order.indexOf(b.contactType);
        });
       setContactList && setContactList((prev) => ({ ...prev, contactDetails: updatedContactDetails }));
      onClose?.(); 
    }
  };

  return { contactType, contactItems, input, setInput, error, handleUpdate };
};

export { useContactEditForm };