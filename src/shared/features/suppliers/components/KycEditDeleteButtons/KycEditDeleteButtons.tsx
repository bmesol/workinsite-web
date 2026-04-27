import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useKycEditDeleteButtons } from "./useKycEditDeleteButtons";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import { KycEditForm } from "../KycEditForm/KycEditForm";
import type { KycEditDeleteButtonsProp } from "./DTOs";

const KycEditDeleteButtons = (props: KycEditDeleteButtonsProp) => {
  const { supplierDetails, setSupplierDetails, selectedItem } = props;
  const { handleDelete } = useKycEditDeleteButtons(props);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{ id: number; type: KYCTypes; value: string } | null>(null);

  const handleEdit = (id: number, type: KYCTypes, value: string) => {
    setEditData({ id, type, value });
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil
          className="h-4 w-4 cursor-pointer text-secondary"
          onClick={() => handleEdit(selectedItem.id, selectedItem.item.kycType, selectedItem.item.value)}
        />
        <Trash2
          className="h-4 w-4 cursor-pointer text-destructive"
          onClick={() => handleDelete(selectedItem.id)}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KYC Type</DialogTitle>
          </DialogHeader>
          {editData && (
            <KycEditForm
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

export { KycEditDeleteButtons };