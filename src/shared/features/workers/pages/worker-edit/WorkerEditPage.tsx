import { useState } from "react";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { BankAccountCreateForm } from "@/shared/components/BankAccount/BankAccountCreateForm/BankAccountCreateForm";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { DatePicker } from "@/shared/components/FormFields/DatePicker";
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
import { useParams, useSearchParams } from "react-router-dom";
import type { Worker } from "../../DTOs/WorkerProps";
import type { GenderTypes } from "../../DTOs/WorkerProps";
import { useWorkerEdit } from "./useWorkerEdit";
import { WorkersUrls } from "../../utils/urls";
import { Card } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

type DialogType = "kyc" | "bankAccount" | "upi" | "contactEdit" | null;

const WorkerEditPage = () => {
  const { t } = useLanguage();
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const closeDialog = () => setActiveDialog(null);

  const {
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    genderItems,
    gender,
    setGender,
    notes,
    setNotes,
    isActive,
    setIsActive,
    workerDetails,
    setWorkerDetails,
    error,
    navigate,
    handleSubmission,
    isKycAddDisabled,
    isBankAccountsAddDisabled,
    isUpiAddDisabled,
    contactDetails,
    workerCategoryDetails,
    contactId,
    workerCategoryId,
    handleWorkerCategoryCreate,
    handleWorkerCategoryEdit,
    handleContactCreate,
    handleContactEdit,
    handleContactChange,
    handleWorkerCategoryChange,
    fetchContacts,
    fetchWorkerCategories,
    contact,
    loading,
    workerCategory,
    primaryContactDetails,
    hasMoreDetails,
    workerRoleCost,
    handleWorkerRoleCostEdit,
  } = useWorkerEdit(id as string, queryString);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">{t('Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title={t("Edit Worker")} />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Name + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NameField
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              required={true}
            />
            <DatePicker
              label={t("Date of Birth")}
              date={dateOfBirth}
              onDateChange={setDateOfBirth}
              errorMessage={error.dateOfBirth}
              required={true}
              minDate={new Date(1900, 0, 1)}
            />
          </div>

          {/* Row 2: Contact + Worker Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(workerDetails as Worker).contact?.id && (
              <ComboboxField
                id="contact"
                label={t("Contact")}
                items={contactDetails}
                selectedValue={contactId}
                onValueChange={handleContactChange}
                onSearch={fetchContacts}
                onCreate={handleContactCreate}
                error={error.contact}
                required
              />
            )}
            {(workerDetails as Worker).workerCategory?.id && (
              <ComboboxField
                id="workerCategory"
                label={t("Worker Category")}
                items={workerCategoryDetails}
                selectedValue={workerCategoryId}
                onValueChange={handleWorkerCategoryChange}
                onSearch={fetchWorkerCategories}
                error={error.workerCategoryId}
                required
                disabled
              />
            )}
          </div>

          {/* Contact Details + Worker Role Cost */}
          {(contactId || (workerRoleCost && workerRoleCost.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactId && (
                <div>
                  <FormActionButton
                    heading={t("Contact detail")}
                    label={t("Edit")}
                    onClick={handleContactEdit}
                    isColsTwo={true}
                  />
                  <div className="flex flex-col gap-2">
                    <ContactTypes
                      contactList={primaryContactDetails}
                      showEditDeleteButtons={false}
                    />
                  </div>
                  {hasMoreDetails && (
                    <button
                      onClick={() => setActiveDialog("contactEdit")}
                      className="ml-3 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      {t("More details...")}
                    </button>
                  )}
                </div>
              )}
              {workerRoleCost && workerRoleCost.length > 0 && (
                <FormActionButton
                  heading={t("Worker Role Cost")}
                  label={t("Edit")}
                  onClick={handleWorkerRoleCostEdit}
                  isColsTwo={true}
                />
              )}
            </div>
          )}

          {/* Gender */}
          {workerDetails.gender && (
            <div className="md:w-1/2">
              <RadioField
                label={t("Gender")}
                items={genderItems}
                inputValue={gender}
                setInputValue={(v) => setGender(v as GenderTypes)}
                errorMessage={error.gender}
                required={true}
              />
            </div>
          )}

          {/* KYC + Bank + UPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KYC */}
            <div>
              <FormActionButton
                heading={t("KYC")}
                label={t("Add")}
                onClick={() => setActiveDialog("kyc")}
                isAddDisabled={isKycAddDisabled}
                isColsTwo={true}
              />
              <KycTypes
                details={{ kycDetails: workerDetails.kycDetails }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({
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
                heading={t("Bank Accounts")}
                label={t("Add")}
                onClick={() => setActiveDialog("bankAccount")}
                isAddDisabled={isBankAccountsAddDisabled}
                isColsTwo={true}
              />
              <BankAccounts
                details={{ bankAccounts: workerDetails.bankAccounts }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({
                    ...prev,
                    bankAccounts: updated.bankAccounts,
                  }))
                }
                isColsTwo={true}
              />
            </div>

            {/* UPI */}
            <div>
              <FormActionButton
                heading={t("UPIs")}
                label={t("Add")}
                onClick={() => setActiveDialog("upi")}
                isAddDisabled={isUpiAddDisabled}
                isColsTwo={true}
              />
              <UpiTypes
                details={{ upiDetails: workerDetails.upiDetails }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({
                    ...prev,
                    upiDetails: updated.upiDetails,
                  }))
                }
                isColsTwo={true}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <Label className="text-base font-medium text-black">
                {t("Is Active")}
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
              placeholder={t("Enter your notes")}
            />
          )}

          {/* Submit */}
          <FormSubmissionButtons
            onCancel={() => navigate(WorkersUrls.list)}
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
            <DialogTitle>{t("KYC Type")}</DialogTitle>
          </DialogHeader>
          <KycCreateForm
            details={{ kycDetails: workerDetails.kycDetails }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({
                ...prev,
                kycDetails: updated.kycDetails,
              }))
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
            <DialogTitle>{t("Bank Account")}</DialogTitle>
          </DialogHeader>
          <BankAccountCreateForm
            details={{ bankAccounts: workerDetails.bankAccounts }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({
                ...prev,
                bankAccounts: updated.bankAccounts,
              }))
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
            <DialogTitle>{t("UPI Type")}</DialogTitle>
          </DialogHeader>
          <UpiCreateForm
            details={{ upiDetails: workerDetails.upiDetails }}
            setDetails={(updated) =>
              setWorkerDetails((prev) => ({
                ...prev,
                upiDetails: updated.upiDetails,
              }))
            }
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { WorkerEditPage };
