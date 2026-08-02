import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactRequest} from "../../DTOs/ContactProps"
import { useContactService } from "../../service/ContactService";
import { toast } from "sonner";  // ✅ replaced useToast
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useContactCreation = (queryString: URLSearchParams) => {
  const [name, setName] = useState(queryString.get("name") || "");
  const [phone, setPhone] = useState("");  // ✅ added phone
  const [contactList, setContactList] = useState<ContactRequest>({ name: "", contactDetails: [] });

  const { error, validate } = useInputValidate({ name, phone });  // ✅ added phone
  const redirectUrl = queryString.get("redirect");
  const contactService = useContactService();
  const navigate = useNavigate();

  const isAddDisabled = [ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS].every((type) => {
    const ContactsCount = contactList.contactDetails.filter((item) => item.contactType === type).length;
    return ContactsCount >= 5;
  });

  const handleSubmission = async () => {
    if (validate()) {
      const contact = { ...contactList, name, phone };
      const response = await contactService.createContact(contact);
      if (redirectUrl) {
        navigate(`${redirectUrl}&name=${name}&contactId=${response.id}`);
        return;
      }
      navigate(ContactsUrls.list);
    }
  };

  const handleCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(ContactsUrls.list);
  };

  return { name, phone, setName, setPhone, error, contactList, setContactList, handleSubmission, handleCancel, isAddDisabled };
  // ✅ expose phone and setPhone
};

export { useContactCreation };