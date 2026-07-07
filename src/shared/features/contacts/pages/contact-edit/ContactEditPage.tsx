import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { ContactCreateForm } from "../../components/ContactCreateForm/ContactCreateForm";
import { NameField } from "@/shared/components/FormFields/NameField";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { ContactTypes } from "@/shared/features/contacts/components/ContactTypes/ContactTypes";
import { Header } from "@/shared/components/Header/Header";
import { useParams, useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useContactEdit } from "./useContactEdit";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const {
    name,
    phone,
    setName,
    setPhone,
    error,
    loading,
    contactList,
    setContactList,
    handleCancel,
    handleSubmission,
    isAddDisabled,
  } = useContactEdit(id as string, queryString);

  const handleAdd = () => {
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-5">
      <Header title={t('Edit Contact')} />
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {name && (
            <NameField
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              className="w-full"
              required={true}
            />
          )}

          <PhoneNumberField
            label={t('Phone Number')}
            inputValue={phone}
            setInputValue={setPhone}
            errorMessage={error.phone}
            className="w-full"
            required={true}
          />
          <FormActionButton
            heading={t('Additional Details')}
            label={t('Add')}
            onClick={handleAdd}
            isAddDisabled={isAddDisabled}
          />
          <ContactTypes
            contactList={contactList}
            setContactList={setContactList}
          />
          <FormSubmissionButtons
            onCancel={handleCancel}
            onSave={handleSubmission}
            className="w-full"
          />
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border overflow-visible">
          <DialogHeader>
            <DialogTitle>{t('Additional Details')}</DialogTitle>
          </DialogHeader>
          <ContactCreateForm
            contactList={contactList}
            setContactList={setContactList}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ContactEditPage };
