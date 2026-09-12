import { useContactEditDeleteButtons } from "./useContactEditDeleteButtons";
import { ContactEditForm } from "../ContactEditForm/ContactEditForm";
import { ContactTypes } from "../../DTOs/ContactProps";
import type { ContactEditDeleteButtonsProps } from "./DTOs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const ContactEditDeleteButtons = (props: ContactEditDeleteButtonsProps) => {
  const { contactList, setContactList, selectedItem, disabled } = props;
  const { handleDelete } = useContactEditDeleteButtons(props);

  // ✅ useModel → useState
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<{ id: number; type: ContactTypes; value: string } | null>(null);

  const handleEdit = (id: number, type: ContactTypes, value: string) => {
    setEditItem({ id, type, value });
    setIsOpen(true); // ✅ model.open → setIsOpen(true)
  };

  return (
    <div className="flex items-center gap-2 mr-2">

      {/* Edit Button */}
      <button
        onClick={() => !disabled && handleEdit(selectedItem.id, selectedItem.item.contactType, selectedItem.item.value)}
        disabled={disabled}
        className="p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => !disabled && handleDelete(selectedItem.id)}
        disabled={disabled}
        className="p-1 rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="h-4 w-4 text-destructive" style={{ color: 'var(--danger-color)' }} />
      </button>

      {/* ✅ useModel → shadcn Dialog */}
      {editItem && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Type</DialogTitle>
            </DialogHeader>
            <ContactEditForm
              contactList={contactList}
              setContactList={setContactList}
              selectedItem={editItem}
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export { ContactEditDeleteButtons };