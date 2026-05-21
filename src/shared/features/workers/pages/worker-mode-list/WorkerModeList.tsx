import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { usePermission } from "@/shared/hooks/usePermission";
import type { WorkModeListProps } from "../../DTOs/WorkModeProps";

const WorkModeList = ({
  workModeDetails = [], 
  handleWorkModeDelete,
  handleWorkModeEdit,
  editingWorkModeId,
}: WorkModeListProps) => {
  const { canEdit } = usePermission();
  const editable = canEdit("Work Mode");

  if (!workModeDetails || workModeDetails.length === 0) { 
    return (
      <div className="flex flex-col items-center mt-8 gap-1">
        <p className="text-base text-gray-500">No Work Modes Available</p>
        <p className="text-sm text-gray-400">Add a new Work Mode to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {workModeDetails.map((item) => {
        const isEditing = item.id === editingWorkModeId;
        return (
          <div
            key={item.id}
            className={`flex items-center justify-between px-4 py-3 rounded-md border ${
              isEditing ? "bg-gray-100 opacity-50" : "bg-white"
            }`}
          >
            <span className="text-base font-medium text-black truncate">
              {item.name}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={isEditing || !editable}
                onClick={() => handleWorkModeEdit(item)}
              >
                <Pencil className="h-4 w-4 text-secondary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={isEditing || !editable}
                onClick={() => handleWorkModeDelete(item.id)}
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

export { WorkModeList };