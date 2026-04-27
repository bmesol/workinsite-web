import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import { BankAccountCreateForm } from "../../components/BankAccountCreateForm/BankAccountCreateForm";
import { ContactEditForm } from "@/shared/features/contacts/components/ContactEditForm/ContactEditForm";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { KycCreateForm } from "../../components/KycCreateForm/KycCreateForm";
import { UpiCreateForm } from "../../components/UpiCreateForm/UpiCreateForm";
import { BankAccounts } from "../../components/BankAccounts/BankAccounts";
import { Header } from "@/shared/components/Header/Header";
import { UpiTypes } from "../../components/UpiTypes/UpiTypes";
import { KycTypes } from "../../components/KycTypes/KycTypes";
import { NameField } from "@/shared/components/FormFields/NameField";
import { useSupplierCreation } from "./useSupplierCreation";
import { SuppliersUrls } from "../../utils/urls";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";

// ─── Dialog state type ────────────────────────────────────────────────────────

type DialogType = "kyc" | "bankAccount" | "upi" | "contactEdit" | null;

// ─── SupplierCreationPage ─────────────────────────────────────────────────────

const SupplierCreationPage = () => {
  const [queryString] = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  const closeDialog = () => setActiveDialog(null);

  const {
    name,
    setName,
    notes,
    setNotes,
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
      <Header title="Create Supplier" />

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
            label="Contact"
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
                heading="Contact detail"
                label="Edit"
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
                  More details...
                </button>
              </div>
            )}
          </>
        )}

        {/* Notes */}
        {notes !== undefined && (
          <div className="flex flex-col gap-1.5 mt-4">
            <Label htmlFor="notes" className="text-base">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your notes"
              rows={4}
            />
          </div>
        )}

        {/* KYC + Bank Accounts + UPI — same as SupplierEditPage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          {/* KYC */}
          <div>
            <FormActionButton
              heading="KYC"
              label="Add"
              onClick={() => setActiveDialog("kyc")}
              isAddDisabled={isKycAddDisabled}
              isColsTwo={true}
            />
            <KycTypes
              supplierDetails={supplierDetails}
              setSupplierDetails={setSupplierDetails}
              isColsTwo={true}
            />
          </div>

          {/* Bank Accounts */}
          <div>
            <FormActionButton
              heading="Bank Accounts"
              label="Add"
              onClick={() => setActiveDialog("bankAccount")}
              isAddDisabled={isBankAccountsAddDisabled}
              isColsTwo={true}
            />
            <BankAccounts
              supplierDetails={supplierDetails}
              setSupplierDetails={setSupplierDetails}
              isColsTwo={true}
            />
          </div>

          {/* UPIs */}
          <div>
            <FormActionButton
              heading="UPIs"
              label="Add"
              onClick={() => setActiveDialog("upi")}
              isAddDisabled={isUpiAddDisabled}
              isColsTwo={true}
            />
            <UpiTypes
              supplierDetails={supplierDetails}
              setSupplierDetails={setSupplierDetails}
              isColsTwo={true}
            />
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
      <Dialog open={activeDialog === "kyc"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KYC Type</DialogTitle>
          </DialogHeader>
          <KycCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Bank Account Dialog */}
      <Dialog open={activeDialog === "bankAccount"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
          </DialogHeader>
          <BankAccountCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* UPI Dialog */}
      <Dialog open={activeDialog === "upi"} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>UPI Type</DialogTitle>
          </DialogHeader>
          <UpiCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Contact Edit Dialog */}
      {contact && (
        <Dialog open={activeDialog === "contactEdit"} onOpenChange={(val) => !val && closeDialog()}>
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