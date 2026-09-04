import { useState } from "react";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { BankAccountCreateForm } from "@/shared/components/BankAccount/BankAccountCreateForm/BankAccountCreateForm";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { ContactsEditForm } from "@/shared/features/clients/components/ContactsEditForm/ContactEditForm";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycCreateForm } from "@/shared/components/Kyc/KycCreateForm/KycCreateForm";
import { UpiCreateForm } from "@/shared/components/Upi/UpiCreateForm/UpiCreateForm";
import { BankAccounts } from "@/shared/components/BankAccount/BankAccounts/BankAccounts";
import { Header } from "@/shared/components/Header/Header";
import { UpiTypes } from "@/shared/components/Upi/UpiTypes/UpiTypes";
import { KycTypes } from "@/shared/components/Kyc/KycTypes/KycTypes";
import { useParams, useSearchParams } from "react-router-dom";
import { useSupplierEdit } from "./useSupplierEdit";
import type { Supplier } from "../../DTOs/SupplierProps";
import { SuppliersUrls } from "../../utils/urls";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SupplierEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);
  const [isUpiOpen, setIsUpiOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t } = useLanguage();

  const {
    name,
    setName,
    notes,
    setNotes,
    isActive,
    setIsActive,
    supplierDetails,
    setSupplierDetails,
    error,
    navigate,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    handleContactEdit,
    loading,
  } = useSupplierEdit(id as string, queryString);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Edit Supplier')} />

      {/* Card */}
      <Card className="mt-4 p-6 bg-white">
        {/* Name + Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NameField
            inputValue={name}
            setInputValue={setName}
            errorMessage={error.name}
            required={true}
          />
          {(supplierDetails as Supplier).contact.id && (
            <ComboboxField
              id="contact"
              label={t('Contact')}
              items={contactDetails}
              selectedValue={contactId}
              onValueChange={handleContactChange}
              onSearch={fetchContacts}
              onCreate={handleContactCreate}
              error={error.contact}
              required={true}
            />
          )}
        </div>

        {/* Contact Details */}
        {contactId && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormActionButton
                heading={t('Contact detail')}
                label={t('Edit')}
                onClick={handleContactEdit}
                isColsTwo={true}
              />
            </div>
            <ContactTypes
              contactList={primaryContactDetails}
              showEditDeleteButtons={false}
              classNames="mt-2"
            />
            {hasMoreDetails && (
              <div className="mt-1">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="ml-3 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  {t('More details...')}
                </button>
              </div>
            )}
          </div>
        )}
        {/* KYC / Bank / UPI / Switch Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KYC */}
          <div>
            <FormActionButton
              heading={t('KYC')}
              label={t('Add')}
              onClick={() => setIsKycOpen(true)}
              isAddDisabled={isKycAddDisabled}
              isColsTwo={true}
            />
            <KycTypes
              details={{ kycDetails: supplierDetails.kycDetails }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({
                  ...prev,
                  kycDetails: updated.kycDetails,
                }))
              }
              isColsTwo={true}
            />
          </div>

          {/* Bank Accounts */}
          <div>
            <FormActionButton
              heading={t('Bank Accounts')}
              label={t('Add')}
              onClick={() => setIsBankAccountOpen(true)}
              isAddDisabled={isBankAccountsAddDisabled}
              isColsTwo={true}
            />
            <BankAccounts
              details={{ bankAccounts: supplierDetails.bankAccounts }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({
                  ...prev,
                  bankAccounts: updated.bankAccounts,
                }))
              }
              isColsTwo={true}
            />
          </div>

          {/* UPIs */}
          <div>
            <FormActionButton
              heading={t('UPIs')}
              label={t('Add')}
              onClick={() => setIsUpiOpen(true)}
              isAddDisabled={isUpiAddDisabled}
              isColsTwo={true}
            />
            <UpiTypes
              details={{ upiDetails: supplierDetails.upiDetails }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({
                  ...prev,
                  upiDetails: updated.upiDetails,
                }))
              }
              isColsTwo={true}
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3">
            <Label className="text-base font-medium text-black">
              {t('Is Active')}
            </Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
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

        {/* Form Submission Buttons */}
        <div className="col-span-12">
          <FormSubmissionButtons
            onCancel={() => navigate(SuppliersUrls.list)}
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
            details={{ kycDetails: supplierDetails.kycDetails }}
            setDetails={(updated) =>
              setSupplierDetails((prev) => ({
                ...prev,
                kycDetails: updated.kycDetails,
              }))
            }
            onClose={() => setIsKycOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Bank Account Dialog */}
      <Dialog open={isBankAccountOpen} onOpenChange={setIsBankAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Bank Account')}</DialogTitle>
          </DialogHeader>
          <BankAccountCreateForm
            details={{ bankAccounts: supplierDetails.bankAccounts }}
            setDetails={(updated) =>
              setSupplierDetails((prev) => ({
                ...prev,
                bankAccounts: updated.bankAccounts,
              }))
            }
            onClose={() => setIsBankAccountOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* UPI Dialog */}
      <Dialog open={isUpiOpen} onOpenChange={setIsUpiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('UPI Type')}</DialogTitle>
          </DialogHeader>
          <UpiCreateForm
            details={{ upiDetails: supplierDetails.upiDetails }}
            setDetails={(updated) =>
              setSupplierDetails((prev) => ({
                ...prev,
                upiDetails: updated.upiDetails,
              }))
            }
            onClose={() => setIsUpiOpen(false)}
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

export { SupplierEditPage };
