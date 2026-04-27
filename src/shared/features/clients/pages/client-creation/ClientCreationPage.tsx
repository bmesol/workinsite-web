import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormActionButton } from "@/shared/components/FormActionButton/FormActionButton";
import { TextareaField } from "@/shared/components/FormFields/TextareaField";
import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { ContactsEditForm } from "../../components/ContactsEditForm/ContactEditForm";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycCreateForm } from "../../components/KycCreateForm/KycCreateForm";
import { Header } from "@/shared/components/Header/Header";
import { KycTypes } from "../../components/KycTypes/KycTypes";
import { useClientCreation } from "./useClientCreation";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Check, ChevronsUpDown, Phone } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/components/lib/utils";

const ClientCreationPage = () => {
  const [queryString] = useSearchParams();
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isComboOpen, setIsComboOpen] = useState(false);

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
      <Header title="Create Client" />

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

            <FormInput errorMessage={error.contact}>
              <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
                <PopoverTrigger asChild>
                  <div className="flex flex-col gap-1 cursor-pointer">
                    <label className="text-base font-semibold mb-1">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-between w-full border rounded-md px-3 py-2">
                      <span className="text-sm text-black">
                        {contactId
                          ? contactDetails.find((c) => c.value === contactId.toString())?.label
                          : "Select contact..."}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 z-[9999]">
                  <Command>
                    <CommandInput
                      placeholder="Search contact..."
                      onValueChange={(val) => fetchContacts(val)}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <button
                          className="text-sm text-primary underline px-2"
                          onClick={() => handleContactCreate("")}
                        >
                          + Create new contact
                        </button>
                      </CommandEmpty>
                      <CommandGroup>
                        {contactDetails.map((item) => (
                          <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(val) => {
                              handleContactChange(val);
                              setIsComboOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", contactId.toString() === item.value ? "opacity-100" : "opacity-0")} />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormInput>
          </div>

          {/* Contact Details */}
          {contact.id ? (
            <>
              <FormActionButton heading="Contact detail" label="Edit" onClick={handleContactEdit} />
              {contact.phone && (
                <div className="flex items-center gap-2 ml-1">
                  <Phone className="h-3 w-3 text-black" />
                  <a href={`tel:${contact.phone}`} className="text-xs text-black hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}
              <ContactTypes contactList={primaryContactDetails} showEditDeleteButtons={false} />
              {hasMoreDetails && (
                <button
                  className="text-sm text-secondary underline text-left ml-3"
                  onClick={() => setIsContactOpen(true)}
                >
                  More details...
                </button>
              )}
            </>
          ) : null}

          {/* Notes */}
          <TextareaField
            label="Notes"
            inputValue={notes}
            setInputValue={setNotes}
            placeholder="Enter your notes"
          />

          {/* KYC */}
          <FormActionButton heading="KYC" label="Add" onClick={() => setIsKycOpen(true)} isAddDisabled={isAddDisabled} />
          <KycTypes clientDetails={clientDetails} setClientDetails={setClientDetails} />

          {/* Submit */}
          <FormSubmissionButtons onCancel={handleCancel} onSave={handleSubmission} />
        </div>
      </Card>

      {/* KYC Dialog */}
      <Dialog open={isKycOpen} onOpenChange={setIsKycOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KYC Type</DialogTitle>
          </DialogHeader>
          <KycCreateForm
            clientDetails={clientDetails}
            setClientDetails={setClientDetails}
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