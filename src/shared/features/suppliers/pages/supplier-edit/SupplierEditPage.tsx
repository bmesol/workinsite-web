import { useState } from "react";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { BankAccountCreateForm } from "../../components/BankAccountCreateForm/BankAccountCreateForm";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { ContactsEditForm } from "@/shared/features/clients/components/ContactsEditForm/ContactEditForm";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycCreateForm } from "../../components/KycCreateForm/KycCreateForm";
import { UpiCreateForm } from "../../components/UpiCreateForm/UpiCreateForm";
import { BankAccounts } from "../../components/BankAccounts/BankAccounts";
import { Header } from "@/shared/components/Header/Header";
import { UpiTypes } from "../../components/UpiTypes/UpiTypes";
import { KycTypes } from "../../components/KycTypes/KycTypes";
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
const SupplierEditPage = () => {
  const { id } = useParams<string>();
  const [queryString] = useSearchParams();
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);
  const [isUpiOpen, setIsUpiOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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
  } = useSupplierEdit(id as string, queryString);

  return (
    <div className="w-full min-h-screen px-4 pb-10">
      <Header title="Edit Supplier" />

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
              label="Contact"
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormActionButton
                heading="Contact detail"
                label="Edit"
                onClick={handleContactEdit}
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
                  onClick={() => setIsContactOpen(true)}
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
          <TextareaField
            label="Notes"
            inputValue={`${notes ? notes : ""}`}
            setInputValue={setNotes}
            placeholder="Enter your notes"
          />
        )}

        {/* KYC / Bank / UPI / Switch Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KYC */}
          <div>
            <FormActionButton
              heading="KYC"
              label="Add"
              onClick={() => setIsKycOpen(true)}
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
              onClick={() => setIsBankAccountOpen(true)}
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
              onClick={() => setIsUpiOpen(true)}
              isAddDisabled={isUpiAddDisabled}
              isColsTwo={true}
            />
            <UpiTypes
              supplierDetails={supplierDetails}
              setSupplierDetails={setSupplierDetails}
              isColsTwo={true}
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3">
            <Label className="text-base font-medium text-black">
              Is Active
            </Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

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
            <DialogTitle>KYC Type</DialogTitle>
          </DialogHeader>
          <KycCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
            onClose={() => setIsKycOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bank Account Dialog */}
      <Dialog open={isBankAccountOpen} onOpenChange={setIsBankAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
          </DialogHeader>
          <BankAccountCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
            onClose={() => setIsBankAccountOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* UPI Dialog */}
      <Dialog open={isUpiOpen} onOpenChange={setIsUpiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>UPI Type</DialogTitle>
          </DialogHeader>
          <UpiCreateForm
            supplierDetails={supplierDetails}
            setSupplierDetails={setSupplierDetails}
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
