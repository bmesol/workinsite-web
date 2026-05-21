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

type DialogType = "kyc" | "bankAccount" | "upi" | "contactEdit" | null;

const WorkerEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const closeDialog = () => setActiveDialog(null);

  const {
    name, setName,
    dateOfBirth, setDateOfBirth,
    genderItems, gender, setGender,
    notes, setNotes,
    isActive, setIsActive,
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
  } = useWorkerEdit(id as string, queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title="Edit Worker" />

      <Card className="mt-4 p-6">
        <div className="flex flex-col gap-4">

          {/* Row 1: Name + DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workerDetails.name && (
              <NameField inputValue={workerDetails.name} setInputValue={(v) => setName(v)} errorMessage={error.name} required={true} />
            )}
            {workerDetails.dateOfBirth && (
              <DateOfBirthField inputValue={workerDetails.dateOfBirth} setInputValue={(v) => setDateOfBirth(v)} errorMessage={error.dateOfBirth} required={true} />
            )}
          </div>

          {/* Row 2: Contact + Worker Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(workerDetails as Worker).contact?.id && (
              <ComboboxField
                id="contact"
                label="Contact"
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
                label="Worker Category"
                items={workerCategoryDetails}
                selectedValue={workerCategoryId}
                onValueChange={handleWorkerCategoryChange}
                onSearch={fetchWorkerCategories}
                onCreate={handleWorkerCategoryCreate}
                error={error.workerCategoryId}
                required
              />
            )}
          </div>

          {/* Contact + Worker Category Details */}
          {(contactId || workerCategoryId) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactId && (
                <div>
                  <FormActionButton heading="Contact detail" label="Edit" onClick={handleContactEdit} isColsTwo={true} />
                  <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} />
                  {hasMoreDetails && (
                    <button
                      onClick={() => setActiveDialog("contactEdit")}
                      className="ml-3 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      More details...
                    </button>
                  )}
                </div>
              )}
              {workerCategoryId && (
                <div>
                  <FormActionButton heading="Worker Category detail" label="Edit" onClick={handleWorkerCategoryEdit} isColsTwo={true} />
                  <div className="mt-2 text-sm text-gray-700">{workerCategory.workerCategoryName}</div>
                </div>
              )}
            </div>
          )}

          {/* Gender */}
          {workerDetails.gender && (
            <RadioField
              label="Gender"
              items={genderItems}
              inputValue={workerDetails.gender as string}
              setInputValue={(v) => setGender(v as GenderTypes)}
              errorMessage={error.gender}
              required={true}
            />
          )}

          {/* Notes */}
          {notes !== undefined && (
            <TextareaField label="Notes" inputValue={`${notes ? notes : ""}`} setInputValue={setNotes} placeholder="Enter your notes" />
          )}

          {/* KYC + Bank + UPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KYC */}
            <div>
              <FormActionButton heading="KYC" label="Add" onClick={() => setActiveDialog("kyc")} isAddDisabled={isKycAddDisabled} isColsTwo={true} />
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
              <FormActionButton heading="Bank Accounts" label="Add" onClick={() => setActiveDialog("bankAccount")} isAddDisabled={isBankAccountsAddDisabled} isColsTwo={true} />
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
              <FormActionButton heading="UPIs" label="Add" onClick={() => setActiveDialog("upi")} isAddDisabled={isUpiAddDisabled} isColsTwo={true} />
              <UpiTypes
                details={{ upiDetails: workerDetails.upiDetails }}
                setDetails={(updated) =>
                  setWorkerDetails((prev) => ({ ...prev, upiDetails: updated.upiDetails }))
                }
                isColsTwo={true}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <Label className="text-base font-medium text-black">Is Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          {/* Submit */}
          <FormSubmissionButtons onCancel={() => navigate(WorkersUrls.list)} onSave={handleSubmission} />
        </div>
      </Card>

      {/* KYC Dialog */}
      <Dialog open={activeDialog === "kyc"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader><DialogTitle>KYC Type</DialogTitle></DialogHeader>
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
          <DialogHeader><DialogTitle>Bank Account</DialogTitle></DialogHeader>
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
          <DialogHeader><DialogTitle>UPI Type</DialogTitle></DialogHeader>
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

export { WorkerEditPage };