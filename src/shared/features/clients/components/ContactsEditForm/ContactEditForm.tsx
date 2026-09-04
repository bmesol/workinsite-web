import { ContactTypes } from "../../../contacts/components/ContactTypes/ContactTypes";
import { ContactTypes as ContactTypeValues } from "../../../contacts/DTOs/ContactProps";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { Button } from "@/shared/components/ui/button";
import { Pencil } from "lucide-react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactsEditForm = (props: { contact: Contact; onEdit: () => void; onClose: () => void }) => {
  const { contact, onEdit, onClose } = props;
  const { t } = useLanguage();

  const filteredContact = {
    ...contact,
    contactDetails: contact.contactDetails.filter(
      (d) => d.contactType !== ContactTypeValues.PHONE
    ),
  };

  return (
    <div className="flex flex-col gap-4 max-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center pr-6">
        <span style={{ fontSize: "var(--font-lg)", fontWeight: 600 }}>
          {t('Contacts')}
        </span>
        <Pencil
          style={{ width: 18, height: 18 }}
          className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
          onClick={onEdit}
        />
      </div>

      {/* Contact Name */}
      <span style={{ fontSize: "var(--font-sm)", color: "#000" }}>
        {contact.name}
      </span>

      {/* Contact Types List */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[125px]">
        <ContactTypes contactList={filteredContact} showEditDeleteButtons={false} />
      </div>

      {/* Cancel Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          {t('Cancel')}
        </Button>
      </div>
    </div>
  );
};

export { ContactsEditForm };
