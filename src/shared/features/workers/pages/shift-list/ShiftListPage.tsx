import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ShiftListProps } from "../../DTOs/ShiftDetails";
import { usePermission } from "@/shared/hooks/usePermission";
import { cn } from "@/shared/components/lib/utils";

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
      {shiftDetails.map((item, index) => {
        const isEditing = item.id === editingShiftId;
        const isFixedMultiplier = fixedMultipliers.includes(item.multiplier);

        return (
          <div
            key={item.id?.toString() || index.toString()}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-md border",
              isEditing ? "bg-gray-100 opacity-50" : "bg-white",
            )}
          >
            {/* Shift Name + Multiplier */}
            <span className="text-base font-medium text-black truncate">
              {item.name}{" "}
              <span className="font-semibold text-[var(--secondary)]">
                [{item.multiplier}]
              </span>
            </span>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={isEditing || !editable}
                onClick={() => handleShiftEdit(item)}
                className={cn(
                  "h-8 w-8",
                  isEditing || !editable
                    ? "text-gray-400 cursor-not-allowed pointer-events-none"
                    : "text-secondary hover:opacity-80",
                )}
              >
                <Pencil className="h-4 w-4 text-secondary" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                disabled={isEditing || !editable || isFixedMultiplier}
                onClick={() => handleShiftDelete(item.id)}
                className={cn(
                  "h-8 w-8",
                  isEditing || !editable || isFixedMultiplier
                    ? "text-gray-400 cursor-not-allowed pointer-events-none"
                    : "text-destructive hover:opacity-80",
                )}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { ShiftListPage };
