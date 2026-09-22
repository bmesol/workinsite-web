import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useKycEditDeleteButtons } from "./useKycEditDeleteButtons";
import { KycForm } from "../KycForm/KycForm";
import { KYCTypes } from "../DTOs/DTOs";
import type { KycEditDeleteButtonsProps } from "./DTOs";

const KycEditDeleteButtons = (props: KycEditDeleteButtonsProps) => {
  const { details, setDetails, selectedItem, disabled } = props;
  const { handleDelete } = useKycEditDeleteButtons(props);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{ id: number; type: KYCTypes; value: string } | null>(
    null
  );

  const handleEdit = (id: number, type: KYCTypes, value: string) => {
    setEditData({ id, type, value });
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil
          className={`w-4 h-4 text-muted-foreground ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-black"}`}
          onClick={() =>
            !disabled &&
            handleEdit(selectedItem.id, selectedItem.item.kycType, selectedItem.item.value)
          }
        />
        <Trash2
          className={`w-4 h-4 text-destructive ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:text-destructive/80"}`}
          style={{ color: "var(--danger-color)" }}
          onClick={() => !disabled && handleDelete(selectedItem.id)}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>KYC Type</DialogTitle>
          </DialogHeader>
          {editData && (
            <KycForm
              details={details}
              setDetails={setDetails}
              selectedItem={editData}
              mode="edit"
              onClose={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { KycEditDeleteButtons };
