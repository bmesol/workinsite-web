import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { ContactCreateForm } from "../../components/ContactCreateForm/ContactCreateForm";
import { NameField } from "@/shared/components/FormFields/NameField";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { ContactTypes } from "@/shared/features/contacts/components/ContactTypes/ContactTypes";
import { Header } from "@/shared/components/Header/Header";
import { useContactCreation } from "./useContactCreation";
import { Card } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactCreationPage = () => {
  const [queryString] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const { name, phone, setName, setPhone, error, contactList, setContactList, handleSubmission, handleCancel, isAddDisabled } = useContactCreation(queryString);

  const handleAdd = () => {
    setIsOpen(true);
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Contact')} />
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          <NameField
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.name}
            className="w-full"
            required={true}
          />

          {/* ✅ added PhoneNumberField */}
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

          <ContactTypes contactList={contactList} setContactList={setContactList} />

          <FormSubmissionButtons
            onCancel={handleCancel}
            onSave={handleSubmission}
            className="w-full"
          />
        </div>
      </Card>

      {/* ✅ replaced useModel with shadcn Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border overflow-y-auto max-h-[90vh]">
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

export { ContactCreationPage };
