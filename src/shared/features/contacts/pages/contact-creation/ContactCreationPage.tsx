import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { ContactCreateForm } from "../../components/ContactCreateForm/ContactCreateForm";
import { NameField } from "@/shared/components/FormFields/NameField";
import { PhoneNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { ContactTypes } from "@/shared/features/contacts/components/ContactTypes/ContactTypes";
import { Header } from "@/shared/components/Header/Header";
import { useContactCreation } from "./useContactCreation";
import { useContactPicker } from "@/shared/hooks/useContactPicker";
import { Card } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { toast } from "sonner";

const ContactCreationPage = () => {
  const [queryString] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const { name, phone, setName, setPhone, error, contactList, setContactList, handleSubmission, handleCancel, isAddDisabled } = useContactCreation(queryString);
  const { isSupported, pickContact } = useContactPicker();

  const handleSelectContact = async () => {
    try {
      const result = await pickContact();
      if (!result) return;
      if (result.name) setName(result.name);
      if (result.phone) setPhone(result.phone);
    } catch {
      toast.error(t("Something went wrong"));
    }
  };

  const handleAdd = () => {
    setIsOpen(true);
  };

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Contact')} />
      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {isSupported && (
            <>
              <FormActionButton
                heading={t('Select Contact')}
                label={t('Select')}
                onClick={handleSelectContact}
                iconType="contacts"
                isColsTwo
              />
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: "var(--gray-color)" }}
              >
                <hr className="flex-1 border-border" />
                <span>{t('OR')}</span>
                <hr className="flex-1 border-border" />
              </div>
            </>
          )}

          <NameField
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.name}
            className="w-full"
            required={true}
          />

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
