import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactsEditForm } from "@/shared/features/clients/components/ContactsEditForm/ContactEditForm";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { NameField } from "@/shared/components/FormFields/NameField";
import { KycCreateForm } from "@/shared/components/Kyc/KycCreateForm/KycCreateForm";
import { Header } from "@/shared/components/Header/Header";
import { KycTypes } from "@/shared/components/Kyc/KycTypes/KycTypes";
import { useParams, useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import type { Client } from "../../DTOs/ClientProps";
import { useClientEdit } from "./useClientEdit";
import { ClientsUrls } from "../../utils/urls";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Phone } from "lucide-react";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ClientEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const { t } = useLanguage();

  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    navigate,
    handleContactEdit,
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
    loading,
  } = useClientEdit(id as string, queryString);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Edit Client')} />

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
            {(clientDetails as Client).contact.id && (
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
            )}
          </div>

          {/* Contact Details + KYC side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Details */}
            <div className="flex flex-col gap-3">
              {contact.id ? (
                <>
                  <FormActionButton
                    heading={t('Contact detail')}
                    label={t('Edit')}
                    onClick={handleContactEdit}
                    isColsTwo
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
            </div>

            {/* KYC */}
            <div className="flex flex-col gap-3">
              <FormActionButton
                heading={t('KYC')}
                label={t('Add')}
                onClick={() => setIsKycOpen(true)}
                isAddDisabled={isAddDisabled}
                isColsTwo
              />
              <KycTypes
                details={{ kycDetails: clientDetails.kycDetails }}
                setDetails={(updated) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    kycDetails: updated.kycDetails,
                  }))
                }
                isColsTwo
              />
            </div>
          </div>

          {/* Notes */}
          {notes !== undefined && (
            <TextareaField
              label={t('Notes')}
              inputValue={`${notes ? notes : ""}`}
              setInputValue={setNotes}
              placeholder={t('Enter your notes')}
            />
          )}

          {/* Submit */}
          <FormSubmissionButtons
            onCancel={() => navigate(ClientsUrls.list)}
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

export { ClientEditPage };
