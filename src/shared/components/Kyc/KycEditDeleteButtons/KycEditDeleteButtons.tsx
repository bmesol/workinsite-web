import { Pencil, Trash2 } from "lucide-react";
import { useKycEditDeleteButtons } from "./useKycEditDeleteButtons";
import { KycEditForm } from "../KycEditForm/KycEditForm";
import type { KycEditDeleteButtonsProps } from "./DTOs";
import { KYCTypes } from "../DTOs/DTOs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useState } from "react";

const KycEditDeleteButtons = (props: KycEditDeleteButtonsProps) => {
  const { details, setDetails, selectedItem } = props;
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
          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-black"
          onClick={() => handleEdit(selectedItem.id, selectedItem.item.kycType, selectedItem.item.value)}
        />
        <Trash2
          className="w-4 h-4 cursor-pointer text-destructive hover:text-destructive/80"
          style={{ color: 'var(--danger-color)' }}
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
              details={details}
              setDetails={setDetails}
              selectedItem={{ id: editData.id, type: editData.type, value: editData.value }}
              onClose={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { KycEditDeleteButtons };