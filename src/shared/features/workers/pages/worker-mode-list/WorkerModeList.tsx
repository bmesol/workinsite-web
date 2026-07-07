import { usePermission } from "@/shared/hooks/usePermission";
import type { WorkModeListProps } from "../../DTOs/WorkModeProps";
import { ListItem } from "@/shared/components/ListItem/ListItem";

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
     {workModeDetails.map((item) => (
  <ListItem
    key={item.id}
    label={item.name}
    isEditing={item.id === editingWorkModeId}
    actions={[
      { type: "edit", onClick: () => handleWorkModeEdit(item), disabled: item.id === editingWorkModeId || !editable },
      { type: "delete", onClick: () => handleWorkModeDelete(item.id), disabled: item.id === editingWorkModeId || !editable },
    ]}
  />
))}
    </div>
  );
};

export { WorkModeList };