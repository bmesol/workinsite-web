import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useUpiEditDeleteButtons } from "./useUpiEditDeleteButtons";
import { UpiEditForm } from "../UpiEditForm/UpiEditForm";
import { UpiTypes, type UpiEditDeleteButtonsProp } from "../DTOs/DTOs";

const UpiEditDeleteButtons = (props: UpiEditDeleteButtonsProp) => {
  const { details, setDetails, selectedItem } = props;
  const { handleDelete } = useUpiEditDeleteButtons(props);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<{ id: number; type: UpiTypes; value: string } | null>(null);

  const handleEdit = (id: number, type: UpiTypes, value: string) => {
    setEditData({ id, type, value });
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4 cursor-pointer text-secondary" onClick={() => handleEdit(selectedItem.id, selectedItem.item.upiType, selectedItem.item.value)} />
        <Trash2 className="h-4 w-4 cursor-pointer text-destructive" onClick={() => handleDelete(selectedItem.id)} />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>UPI Type</DialogTitle></DialogHeader>
          {editData && (
            <UpiEditForm
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

export { UpiEditDeleteButtons };