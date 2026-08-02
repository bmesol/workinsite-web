import type { SelectedItemProps, WorkType, WorkTypeListProps, WorkTypeNew } from "../../DTOs/WorkTypeProps";
import { useState } from "react";
import { useWorkTypeService } from "../../service/WorkerTypeService";
import { toast } from "sonner";

export const useWorkTypeList = (props: WorkTypeListProps) => {
  const {
    workTypeList,
    setWorkTypeList,
    updatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,
    setUpdatedWorkTypeList,
  } = props;

  const [selectedItem, setSelectedItem] = useState<SelectedItemProps | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);        // ← replaces bottomSheetRef
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);    // ← replaces Alert
  const [pendingDelete, setPendingDelete] = useState<{ index: number; source: string; item: any } | null>(null);

  const WorkTypeService = useWorkTypeService();

  const handleEdit = (index: number, value: WorkType | WorkTypeNew, source: string) => {
    setSelectedItem({ index, value, source });
    setEditDialogOpen(true);   // ← replaces bottomSheetRef.current?.open()
  };

  const handleDeleteClick = async (index: number, source: string, item: any) => {
    if (source === "update" && item.id) {
      const isInUse = await WorkTypeService.getWorkTypeUsage(item.id);
      if (isInUse === true) {
        toast.error("This work type is currently in use and cannot be deleted.");
        return;
      }
    }
    setPendingDelete({ index, source, item });
    setDeleteDialogOpen(true);   // ← replaces Alert.alert
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { index, source, item } = pendingDelete;

    if (source === "new") {
      const updated = [...(workTypeList || [])];
      updated.splice(index, 1);
      setWorkTypeList(updated);
    } else if (source === "update" && updatedWorkTypeList && setUpdatedWorkTypeList) {
      const updated = [...(updatedWorkTypeList || [])];
      updated.splice(index, 1);
      setUpdatedWorkTypeList(updated);
      if (deletedWorkTypeList && setDeletedWorkTypeList && item.id) {
        setDeletedWorkTypeList([...deletedWorkTypeList, item.id]);
      }
    }

    setPendingDelete(null);
    setDeleteDialogOpen(false);
  };

  return {
    handleDeleteClick,
    confirmDelete,
    handleEdit,
    selectedItem,
    setSelectedItem,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
};