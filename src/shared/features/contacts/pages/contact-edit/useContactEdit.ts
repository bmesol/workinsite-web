import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactRequest } from "../../DTOs/ContactProps";
import { useContactService } from "../../service/ContactService";
import { toast } from "sonner"; 
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useContactEdit = (id: string, queryString: URLSearchParams) => {
  const redirectUrl = queryString.get("redirect");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");  
  const [contactList, setContactList] = useState<ContactRequest>({ name: "", contactDetails: [] });

  const { error, validate } = useInputValidate({ name, phone });  
  const contactService = useContactService();
  const navigate = useNavigate();

  const isAddDisabled = [ ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS ].every((type) => {
    const ContactsCount = contactList.contactDetails.filter((item) => item.contactType === type).length;
    return ContactsCount >= 5;
  });

 const fetchContact = async () => {
  const contactData = await contactService.getContact(parseInt(id));
  setContactList(contactData);
  setName(contactData.name ?? "");    // ✅ sync name state
  setPhone(contactData.phone ?? "");  // ✅ sync phone state
};
  useEffect(() => { fetchContact() }, []);

const handleSubmission = async () => {
  if (validate()) {
    if (!phone && contactList.contactDetails.length === 0) {
      toast.error("Please add at least one contact.");
    } else {
      const contact = { ...contactList, name, phone };
      await contactService.updateContact(parseInt(id), contact);
      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }
      navigate(ContactsUrls.list);
    }
  }
};
  const handleCancel = () => {
    if (redirectUrl) {
      navigate(`${redirectUrl}`);
      return;
    }
    navigate(ContactsUrls.list);
  };

  return { name, phone, setName, setPhone, error, contactList, setContactList, handleCancel, handleSubmission, isAddDisabled }; // ✅ expose setPhone
};

export { useContactEdit };