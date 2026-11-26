import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactRequest, ContactDetail } from "../../DTOs/ContactProps";
import { useContactService } from "../../service/ContactService";
import { toast } from "sonner";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";

type InitialContactData = {
  name: string;
  phone: string;
  contactDetails: ContactDetail[];
};

const useContactEdit = (id: string, queryString: URLSearchParams) => {
  const redirectUrl = queryString.get("redirect");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactList, setContactList] = useState<ContactRequest>({ name: "", contactDetails: [] });
  const [initialData, setInitialData] = useState<InitialContactData | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { error, validate } = useInputValidate({ name, phone });
  const contactService = useContactService();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isAddDisabled = [ContactTypes.PHONE, ContactTypes.EMAIL, ContactTypes.ADDRESS].every((type) => {
    const count = contactList.contactDetails.filter((item) => item.contactType === type).length;
    return count >= 5;
  });

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      try {
        const contactData = await contactService.getContact(parseInt(id));
        setContactList(contactData);
        setName(contactData.name ?? "");
        setPhone(contactData.phone ?? "");
        setInitialData({
          name: contactData.name ?? "",
          phone: contactData.phone ?? "",
          contactDetails: contactData.contactDetails ?? [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  const hasUnsavedChanges = () => {
    if (!initialData) return false;
    return (
      name !== initialData.name ||
      phone !== initialData.phone ||
      JSON.stringify(contactList.contactDetails) !== JSON.stringify(initialData.contactDetails)
    );
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const navigateBack = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(ContactsUrls.list);
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (!phone && contactList.contactDetails.length === 0) {
        toast.error("Please add at least one contact.");
      } else {
        const contact = { ...contactList, name, phone };
        await contactService.updateContact(parseInt(id), contact);
        setInitialData({ name, phone, contactDetails: contactList.contactDetails });
        navigateBack();
      }
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigateBack();
    }
  };

  const handleKeepEditing = () => {
    setShowUnsavedDialog(false);
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigateBack();
  };

  const handleSaveFromDialog = async () => {
    if (!validate()) return;
    if (!phone && contactList.contactDetails.length === 0) {
      toast.error("Please add at least one contact.");
      return;
    }
    setShowUnsavedDialog(false);
    const contact = { ...contactList, name, phone };
    await contactService.updateContact(parseInt(id), contact);
    setInitialData({ name, phone, contactDetails: contactList.contactDetails });
    navigateBack();
  };

  return {
    name, phone, setName, setPhone, error, contactList, setContactList,
    handleCancel, loading, handleSubmission, isAddDisabled,
    showUnsavedDialog, handleKeepEditing, handleDiscardChanges, handleSaveFromDialog,
  };
};

export { useContactEdit };
