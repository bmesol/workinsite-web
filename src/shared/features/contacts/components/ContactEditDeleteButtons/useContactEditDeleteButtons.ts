import type { ContactEditDeleteButtonsProps } from "./DTOs";

const useContactEditDeleteButtons = (props: ContactEditDeleteButtonsProps) => {
  const { contactList, setContactList } = props;

  const handleDelete = (id: number) => {
    const filteredContactDetails = contactList.contactDetails.filter((_, index) => index !== id);
    setContactList && setContactList((prev) => ({ ...prev, contactDetails: filteredContactDetails }));
  };

  return { handleDelete };
};

export { useContactEditDeleteButtons };