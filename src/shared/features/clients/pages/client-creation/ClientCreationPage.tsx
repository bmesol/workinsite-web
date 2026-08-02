import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { ContactsEditForm } from "../../components/ContactsEditForm/ContactEditForm";
import { NameField } from "@/shared/components/FormFields/NameField";
import { KycCreateForm } from "@/shared/components/Kyc/KycCreateForm/KycCreateForm";
import { Header } from "@/shared/components/Header/Header";
import { KycTypes } from "@/shared/components/Kyc/KycTypes/KycTypes";
import { useClientCreation } from "./useClientCreation";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Phone } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ClientCreationPage = () => {
  const [queryString] = useSearchParams();
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t } = useLanguage();

  const {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    handleCancel,
    isContactEditOpen,
    setIsContactEditOpen,
  } = useClientCreation(queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Client')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Name + Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NameField
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              required={true}
            />

            <ComboboxField
              id="contact-combobox"
              label={t('Contact')}
              items={contactDetails}
              selectedValue={contactId}
              onValueChange={handleContactChange}
              onSearch={fetchContacts}
              onCreate={handleContactCreate}
              error={error.contact}
              required
            />
          </div>

          {/* Contact Details */}
          {contact.id ? (
            <>
              <FormActionButton
                heading={t('Contact detail')}
                label={t('Edit')}
                onClick={handleContactEdit}
              />
              {contact.phone && (
                <div className="flex items-center gap-2 ml-1">
                  <Phone className="h-4 w-4 text-black" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-black hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              <ContactTypes
                contactList={primaryContactDetails}
                showEditDeleteButtons={false}
              />
              {hasMoreDetails && (
                <button
                  className="text-sm text-secondary underline text-left ml-3"
                  onClick={() => setIsContactOpen(true)}
                >
                  {t('More details...')}
                </button>
              )}
            </>
          ) : null}

          {/* Notes */}
          <TextareaField
            label={t('Notes')}
            inputValue={notes}
            setInputValue={setNotes}
            placeholder={t('Enter your notes')}
          />

          {/* KYC */}
          <FormActionButton
            heading={t('KYC')}
            label={t('Add')}
            onClick={() => setIsKycOpen(true)}
            isAddDisabled={isAddDisabled}
          />
          <KycTypes
            details={{ kycDetails: clientDetails.kycDetails }}
            setDetails={(updated) =>
              setClientDetails((prev) => ({
                ...prev,
                kycDetails: updated.kycDetails,
              }))
            }
          />

          {/* Submit */}
          <FormSubmissionButtons
            onCancel={handleCancel}
            onSave={handleSubmission}
          />
        </div>
      </Card>

      {/* KYC Dialog */}
      <Dialog open={isKycOpen} onOpenChange={setIsKycOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('KYC Type')}</DialogTitle>
          </DialogHeader>
          <KycCreateForm
            details={{ kycDetails: clientDetails.kycDetails }}
            setDetails={(updated) =>
              setClientDetails((prev) => ({
                ...prev,
                kycDetails: updated.kycDetails,
              }))
            }
            onClose={() => setIsKycOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Contact More Details Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent>
          <ContactsEditForm
            contact={contact}
            onEdit={handleContactEdit}
            onClose={() => setIsContactOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ClientCreationPage };
