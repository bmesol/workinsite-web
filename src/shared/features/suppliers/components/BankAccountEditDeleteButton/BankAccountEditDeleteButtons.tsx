import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useBankAccountEditDeleteButtons } from "./useBankAccountEditDeleteButtons";
import { BankAccountEditForm } from "../BankAccountEditForm/BankAccountEditForm";
import type { BankAccountEditDeleteButtonsProp } from "./DTOs";

type EditData = {
  id: number;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
};

const BankAccountEditDeleteButtons = (props: BankAccountEditDeleteButtonsProp) => {
  const { supplierDetails, setSupplierDetails, selectedItem } = props;
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
          className="h-4 w-4 cursor-pointer text-secondary"
          onClick={handleEdit}
        />
        <Trash2
          className="h-4 w-4 cursor-pointer text-destructive"
          onClick={() => handleDelete(selectedItem.id)}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Account</DialogTitle>
          </DialogHeader>
          {editData && (
            <BankAccountEditForm
              supplierDetails={supplierDetails}
              setSupplierDetails={setSupplierDetails}
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