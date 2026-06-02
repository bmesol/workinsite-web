import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ShiftListProps } from "../../DTOs/ShiftDetails";
import { usePermission } from "@/shared/hooks/usePermission";
import { cn } from "@/shared/components/lib/utils";
import { ListItem } from "@/shared/components/ListItem/ListItem";
const ShiftListPage = ({
  shiftDetails = [],
  editingShiftId,
  handleShiftDelete,
  handleShiftEdit,
}: ShiftListProps) => {
  const { canEdit } = usePermission();
  const editable = canEdit("Shift");

  const fixedMultipliers = ["0.50", "1.00", "1.50", "2.00"];

  if (!shiftDetails || shiftDetails.length === 0) {
    return (
      <div className="flex flex-col items-center mt-8 gap-1">
        <p className="text-base text-gray-500">No Shifts Available</p>
        <p className="text-sm text-gray-400">Add a new Shift to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
{shiftDetails.map((item) => {
  const isFixedMultiplier = fixedMultipliers.includes(item.multiplier); // ✅ define here

  return (
    <ListItem
      key={item.id}
      label={item.name}
      sublabel={item.multiplier}
      isEditing={item.id === editingShiftId}
      actions={[
        { type: "edit", onClick: () => handleShiftEdit(item), disabled: item.id === editingShiftId || !editable },
        { type: "delete", onClick: () => handleShiftDelete(item.id), disabled: item.id === editingShiftId || !editable || isFixedMultiplier }, // ✅ now in scope
      ]}
    />
  );
})}
    </div>
  );
};

export { ShiftListPage };
