import type { UnitListProps } from "../../DTOs/UnitDetails";
import { usePermission } from "@/shared/hooks/usePermission";
import { ListItem } from "@/shared/components/ListItem/ListItem";

const UnitList = ({
  unitDetails,
  handleUnitDelete,
  handleUnitEdit,
  editingUnitId,
}: UnitListProps) => {
  const { canEdit } = usePermission();
  const editable = canEdit("Unit");

  if (!unitDetails.length) {
    return (
      <div className="flex flex-col items-center mt-8 gap-1">
        <p className="text-base" style={{ color: "var(--gray-color)" }}>
          No Units Available
        </p>
        <p className="text-sm" style={{ color: "var(--gray-color)" }}>
          Add a new unit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
    {unitDetails.map((item) => (
  <ListItem
    key={item.id}
    label={item.name}
    isEditing={item.id === editingUnitId}
    actions={[
      { type: "edit", onClick: () => handleUnitEdit(item), disabled: item.id === editingUnitId || !editable },
      { type: "delete", onClick: () => handleUnitDelete(item.id), disabled: item.id === editingUnitId || !editable },
    ]}
  />
))}
    </div>
  );
};

export { UnitList };