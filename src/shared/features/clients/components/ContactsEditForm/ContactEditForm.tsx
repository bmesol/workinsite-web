import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { Button } from "@/shared/components/ui/button";
import { Pencil } from "lucide-react";

const ContactsEditForm = (props: { contact: Contact; onEdit: () => void; onClose: () => void }) => {
  const { contact, onEdit, onClose } = props;

  return (
    <div className="flex flex-col gap-4 max-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-slate-900">Contacts</span>
        <Pencil className="w-5 h-5 cursor-pointer" onClick={onEdit} />
      </div>

      {/* Contact Name */}
      <span className="text-black text-sm">{contact.name}</span>

      {/* Contact Types List */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[125px]">
        <ContactTypes contactList={contact} showEditDeleteButtons={false} />
      </div>

      {/* Cancel Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export { ContactsEditForm };