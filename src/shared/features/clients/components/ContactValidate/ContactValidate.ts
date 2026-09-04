import {  ContactTypes } from "@/shared/features/contacts/DTOs/ContactProps";
import type { Contact } from "../../../contacts/DTOs/ContactProps";

const useContactValidate = (contact: Contact, includePhone = false) => {
  const phoneEntry = includePhone && contact.phone
    ? { contactType: ContactTypes.PHONE, value: contact.phone }
    : undefined;

  const findPrimaryContactDetails = [
    phoneEntry,
    contact.contactDetails.find((item) => item.contactType === ContactTypes.EMAIL),
    contact.contactDetails.find((item) => item.contactType === ContactTypes.ADDRESS),
  ].filter(Boolean);

  const primaryContactDetails = {...contact, contactDetails: findPrimaryContactDetails as Array<{contactType: ContactTypes, value: string}>};
  const countByType = (type: ContactTypes) => contact.contactDetails.filter((item) => item.contactType === type).length;
  const hasMoreDetails = [ContactTypes.EMAIL, ContactTypes.ADDRESS].some((type) => countByType(type) > 1);

  return { primaryContactDetails, hasMoreDetails }
};

export { useContactValidate };
