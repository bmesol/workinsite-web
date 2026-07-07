import { useState } from "react";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { BankAccountCreateForm } from "@/shared/components/BankAccount/BankAccountCreateForm/BankAccountCreateForm";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { DateOfBirthField } from "@/shared/components/FormFields/DateOfBirthField";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { RadioField } from "@/shared/components/FormFields/RadioField";
import { NameField } from "@/shared/components/FormFields/NameField";
import { KycCreateForm } from "@/shared/components/Kyc/KycCreateForm/KycCreateForm";
import { UpiCreateForm } from "@/shared/components/Upi/UpiCreateForm/UpiCreateForm";
import { BankAccounts } from "@/shared/components/BankAccount/BankAccounts/BankAccounts";
import { Header } from "@/shared/components/Header/Header";
import { KycTypes } from "@/shared/components/Kyc/KycTypes/KycTypes";
import { UpiTypes } from "@/shared/components/Upi/UpiTypes/UpiTypes";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { useWorkerCreation } from "./useWorkerCreation";
import { useSearchParams } from "react-router-dom";
import { WorkersUrls } from "../../utils/urls";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { GenderTypes } from "../../DTOs/WorkerProps";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

type DialogType = "kyc" | "bankAccount" | "upi" | "contactEdit" | null;

const WorkerCreationPage = () => {
  const { t } = useLanguage();
  const [queryString] = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const closeDialog = () => setActiveDialog(null);

  const {
    name, setName,
    dateOfBirth, setDateOfBirth,
    genderItems, gender, setGender,
    notes, setNotes,
    workerDetails, setWorkerDetails,
    error, navigate, handleSubmission,
    isKycAddDisabled, isBankAccountsAddDisabled, isUpiAddDisabled,
    contactDetails, workerCategoryDetails,
    contactId, workerCategoryId,
    handleWorkerCategoryCreate, handleWorkerCategoryEdit,
    handleContactCreate, handleContactEdit,
    handleContactChange, handleWorkerCategoryChange,
    fetchContacts, fetchWorkerCategories,
    contact, workerCategory,
    primaryContactDetails, hasMoreDetails,
  } = useWorkerCreation(queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t('Create Worker')} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Row 1: Name + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NameField inputValue={name} setInputValue={setName} errorMessage={error.name} required={true} />
            <DateOfBirthField inputValue={dateOfBirth} setInputValue={setDateOfBirth} errorMessage={error.dateOfBirth} required={true} />
          </div>

          {/* Row 2: Contact + Worker Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboboxField
              id="contact"
              label={t('Contact')}
              items={contactDetails}
              selectedValue={contactId}
              onValueChange={handleContactChange}
              onSearch={fetchContacts}
              onCreate={handleContactCreate}
              error={error.contact}
              required
            />
            <ComboboxField
              id="workerCategory"
              label={t('Worker Category')}
              items={workerCategoryDetails}
              selectedValue={workerCategoryId}
              onValueChange={handleWorkerCategoryChange}
              onSearch={fetchWorkerCategories}
              onCreate={handleWorkerCategoryCreate}
              error={error.workerCategoryId}
              required
            />
          </div>

          {/* Contact + Worker Category Details */}
          {(contactId || workerCategoryId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactId && (
                <div>
                  <FormActionButton heading={t('Contact detail')} label={t('Edit')} onClick={handleContactEdit} isColsTwo={true} />
                  <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} />
                  {hasMoreDetails && (
                    <button
                      onClick={() => setActiveDialog("contactEdit")}
                      className="ml-3 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      {t('More details...')}
                    </button>
                  )}
                </div>
              )}
              {workerCategoryId && (
                <div>
                  <FormActionButton heading={t('Worker Category detail')} label={t('Edit')} onClick={handleWorkerCategoryEdit} isColsTwo={true} />
                  <div className="mt-2 text-sm text-gray-700">{workerCategory.name}</div>
                </div>
              )}
            </div>
          )}

          {/* Gender */}
<RadioField
  label={t('Gender')}
  items={genderItems}
  inputValue={gender as string}
  setInputValue={(value) => setGender(value as GenderTypes)}
  errorMessage={error.gender}
  required={true}
/>
          <TextareaField label="Notes" inputValue={notes} setInputValue={setNotes} placeholder={t('Enter your notes')} />

          {/* KYC + Bank + UPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KYC */}
            <div>
              <FormActionButton heading={t('KYC')} label={t('Add')} onClick={() => setActiveDialog("kyc")} isAddDisabled={isKycAddDisabled} isColsTwo={true} />
              <KycTypes
                details={{ kycDetails: workerDetails.kycDetails }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({ ...prev, kycDetails: updated.kycDetails }))
                }
                isColsTwo={true}
              />
            </div>

            {/* Bank Accounts */}
            <div>
              <FormActionButton heading={t('Bank Accounts')} label={t('Add')} onClick={() => setActiveDialog("bankAccount")} isAddDisabled={isBankAccountsAddDisabled} isColsTwo={true} />
              <BankAccounts
                details={{ bankAccounts: workerDetails.bankAccounts }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({ ...prev, bankAccounts: updated.bankAccounts }))
                }
                isColsTwo={true}
              />
            </div>

            {/* UPI */}
            <div>
              <FormActionButton heading={t('UPIs')} label={t('Add')} onClick={() => setActiveDialog("upi")} isAddDisabled={isUpiAddDisabled} isColsTwo={true} />
              <UpiTypes
                details={{ upiDetails: workerDetails.upiDetails }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({ ...prev, upiDetails: updated.upiDetails }))
                }
                isColsTwo={true}
              />
            </div>
          </div>

          {/* Submit */}
          <FormSubmissionButtons onCancel={() => navigate(WorkersUrls.list)} onSave={handleSubmission} />
        </div>
      </Card>

      {/* KYC Dialog */}
      <Dialog open={activeDialog === "kyc"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('KYC Type')}</DialogTitle></DialogHeader>
          <KycCreateForm
            details={{ kycDetails: workerDetails.kycDetails }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({ ...prev, kycDetails: updated.kycDetails }))
            }
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Bank Account Dialog */}
      <Dialog open={activeDialog === "bankAccount"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('Bank Account')}</DialogTitle></DialogHeader>
          <BankAccountCreateForm
            details={{ bankAccounts: workerDetails.bankAccounts }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({ ...prev, bankAccounts: updated.bankAccounts }))
            }
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* UPI Dialog */}
      <Dialog open={activeDialog === "upi"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('UPI Type')}</DialogTitle></DialogHeader>
          <UpiCreateForm
            details={{ upiDetails: workerDetails.upiDetails }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({ ...prev, upiDetails: updated.upiDetails }))
            }
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { WorkerCreationPage };
