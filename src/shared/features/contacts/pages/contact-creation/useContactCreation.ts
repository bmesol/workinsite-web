import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { Contact, ContactRequest} from "../../DTOs/ContactProps"
import { useContactService } from "../../service/ContactService";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";

const useContactCreation = (queryString: URLSearchParams) => {
  const [name, setName] = useState(queryString.get("name") || "");
  const [phone, setPhone] = useState("");
  const [contactList, setContactList] = useState<ContactRequest>({ name: "", contactDetails: [] });
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate } = useInputValidate({ name, phone });
  const redirectUrl = queryString.get("redirect");
  const contactService = useContactService();
  const navigate = useNavigate();

  const isAddDisabled = [ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS].every((type) => {
    const ContactsCount = contactList.contactDetails.filter((item) => item.contactType === type).length;
    return ContactsCount >= 5;
  });

  const hasUnsavedChanges = () =>
    name.trim() !== '' ||
    phone.trim() !== '' ||
    contactList.contactDetails.length > 0;

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleSubmission = async () => {
    if (validate()) {
      const contact = { ...contactList, name, phone };
      const response = await contactService.createContact(contact) as Contact;
      if (redirectUrl) {
        navigate(`${redirectUrl}&name=${name}&contactId=${response.id}`);
        return;
      }
      navigate(ContactsUrls.list);
    }
  };

  const navigateBack = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(ContactsUrls.list);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      return;
    }
    navigateBack();
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigateBack();
  };
  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    await handleSubmission();
  };

  return {
    name, phone, setName, setPhone, error, contactList, setContactList,
    handleSubmission, handleCancel, isAddDisabled,
    showUnsavedDialog, handleKeepEditing, handleDiscardChanges, handleSaveFromDialog,
  };
};

export { useContactCreation };