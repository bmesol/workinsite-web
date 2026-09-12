import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useBankAccountEditDeleteButtons } from "./useBankAccountEditDeleteButtons";
import { BankAccountEditForm } from "../BankAccountEditForm/BankAccountEditForm";
import type { BankAccountEditDeleteButtonsProp } from "../DTOs/DTOs";

type EditData = {
  id: number;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
};

const BankAccountEditDeleteButtons = (props: BankAccountEditDeleteButtonsProp) => {
  const { details, setDetails, selectedItem, disabled } = props;
  const { handleDelete } = useBankAccountEditDeleteButtons(props);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);

  const handleEdit = () => {
    setEditData({
      id: selectedItem.id,
      accountName: selectedItem.item.accountName,
      accountNumber: selectedItem.item.accountNumber,
      ifscCode: selectedItem.item.ifscCode,
    });
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil
          className={`h-4 w-4 text-secondary ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !disabled && handleEdit()}
        />
        <Trash2
          className={`h-4 w-4 text-destructive hover:text-destructive/80 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          style={{ color: 'var(--danger-color)' }}
          onClick={() => !disabled && handleDelete(selectedItem.id)}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
          </DialogHeader>
          {editData && (
            <BankAccountEditForm
              details={details}
              setDetails={setDetails}
              selectedItem={editData}
              onClose={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { BankAccountEditDeleteButtons };