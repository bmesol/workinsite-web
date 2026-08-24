import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { BankAccountCreateForm } from "@/shared/components/BankAccount/BankAccountCreateForm/BankAccountCreateForm";
import { ContactEditForm } from "@/shared/features/contacts/components/ContactEditForm/ContactEditForm";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { KycCreateForm } from "@/shared/components/Kyc/KycCreateForm/KycCreateForm";
import { UpiCreateForm } from "@/shared/components/Upi/UpiCreateForm/UpiCreateForm";
import { BankAccounts } from "@/shared/components/BankAccount/BankAccounts/BankAccounts";
import { Header } from "@/shared/components/Header/Header";
import { UpiTypes } from "@/shared/components/Upi/UpiTypes/UpiTypes";
import { KycTypes } from "@/shared/components/Kyc/KycTypes/KycTypes";
import { NameField } from "@/shared/components/FormFields/NameField";
import { useSupplierCreation } from "./useSupplierCreation";
import { SuppliersUrls } from "../../utils/urls";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { Switch } from "@/shared/components/ui/switch";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

// ─── Dialog state type ────────────────────────────────────────────────────────

type DialogType = "kyc" | "bankAccount" | "upi" | "contactEdit" | null;

// ─── SupplierCreationPage ─────────────────────────────────────────────────────

const SupplierCreationPage = () => {
  const [queryString] = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const { t } = useLanguage();

  const closeDialog = () => setActiveDialog(null);

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
  } = useSupplierCreation(queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Supplier')} />

      <Card className="mt-4 p-6">
        {/* Row 1: Name + Contact */}
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

        {/* Contact Details Section */}
        {contactId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormActionButton
                heading={t('Contact detail')}
                label={t('Edit')}
                onClick={() => handleContactEdit(closeDialog)}
                isColsTwo={true}
              />
            </div>
            <ContactTypes
              contactList={primaryContactDetails}
              showEditDeleteButtons={false}
            />
            {hasMoreDetails && (
              <div>
                <button
                  onClick={() => setActiveDialog("contactEdit")}
                  className="ml-3 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  {t('More details...')}
                </button>
              </div>
            )}
          </>
        )}

        {/* Notes */}
        {notes !== undefined && (
          <div className="flex flex-col gap-1.5 mt-4">
            <Label htmlFor="notes" className="text-base">
              {t('Notes')}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('Enter your notes')}
              rows={4}
            />
          </div>
        )}

        {/* KYC / Bank Accounts / UPIs / Is Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KYC */}
          <div>
            <FormActionButton
              heading={t('KYC')}
              label={t('Add')}
              onClick={() => setActiveDialog("kyc")}
              isAddDisabled={isKycAddDisabled}
              isColsTwo={true}
            />
            <KycTypes
              details={{ kycDetails: supplierDetails.kycDetails }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({ ...prev, kycDetails: updated.kycDetails }))
              }
              isColsTwo={true}
            />
          </div>

          {/* Bank Accounts */}
          <div>
            <FormActionButton
              heading={t('Bank Accounts')}
              label={t('Add')}
              onClick={() => setActiveDialog("bankAccount")}
              isAddDisabled={isBankAccountsAddDisabled}
              isColsTwo={true}
            />
            <BankAccounts
              details={{ bankAccounts: supplierDetails.bankAccounts }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({ ...prev, bankAccounts: updated.bankAccounts }))
              }
              isColsTwo={true}
            />
          </div>

          {/* UPIs */}
          <div>
            <FormActionButton
              heading={t('UPIs')}
              label={t('Add')}
              onClick={() => setActiveDialog("upi")}
              isAddDisabled={isUpiAddDisabled}
              isColsTwo={true}
            />
            <UpiTypes
              details={{ upiDetails: supplierDetails.upiDetails }}
              setDetails={(updated) =>
                setSupplierDetails((prev) => ({ ...prev, upiDetails: updated.upiDetails }))
              }
              isColsTwo={true}
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3">
            <Label className="text-base font-medium text-black">{t('Is Active')}</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        {/* Footer: Cancel + Save */}
        <div className="flex justify-end gap-2 pt-4  ">
          <FormSubmissionButtons
            onCancel={() => navigate(SuppliersUrls.list)}
            onSave={handleSubmission}
          />
        </div>
      </Card>

      {/* KYC Dialog */}
<Dialog
  open={activeDialog === "kyc"}
  onOpenChange={(val) => !val && closeDialog()}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{t('KYC Type')}</DialogTitle>
    </DialogHeader>
    <KycCreateForm
      details={{ kycDetails: supplierDetails.kycDetails }}
      setDetails={(updated) =>
        setSupplierDetails((prev) => ({ ...prev, kycDetails: updated.kycDetails }))
      }
      onClose={closeDialog}
    />
  </DialogContent>
</Dialog>
      {/* Bank Account Dialog */}
      <Dialog
        open={activeDialog === "bankAccount"}
        onOpenChange={(val) => !val && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Bank Account')}</DialogTitle>
          </DialogHeader>
           <BankAccountCreateForm
      details={{ bankAccounts: supplierDetails.bankAccounts }}
      setDetails={(updated) =>
        setSupplierDetails((prev) => ({ ...prev, bankAccounts: updated.bankAccounts }))
      }
      onClose={closeDialog}
    />
        </DialogContent>
      </Dialog>

      {/* UPI Dialog */}
      <Dialog
        open={activeDialog === "upi"}
        onOpenChange={(val) => !val && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('UPI Type')}</DialogTitle>
          </DialogHeader>
        <UpiCreateForm
  details={{ upiDetails: supplierDetails.upiDetails }}
  setDetails={(updated) =>
    setSupplierDetails((prev) => ({ ...prev, upiDetails: updated.upiDetails }))
  }
  onClose={closeDialog}
/>
        </DialogContent>
      </Dialog>

      {/* Contact Edit Dialog */}
      {contact && (
        <Dialog
          open={activeDialog === "contactEdit"}
          onOpenChange={(val) => !val && closeDialog()}
        >
          <DialogContent>
            <ContactEditForm
              contactList={contact}
              setContactList={() => handleContactEdit(closeDialog)}
              selectedItem={{
                id: 0,
                type: contact.contactDetails[0]?.contactType,
                value: contact.contactDetails[0]?.value ?? "",
              }}
              onClose={closeDialog}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export { SupplierCreationPage };
