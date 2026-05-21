import type { WorkerRole, WorkerRoleListProps, WorkerRoles } from "../../DTOs/WorkRoleProps";
import { useState } from "react";
import { useWorkerRoleService } from "../../service/WorkerRoleService";
import { toast } from "sonner";

export const useWorkerRoleList = (props: WorkerRoleListProps) => {
  const {
    workerRoleList,
    setWorkerRoleList,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
  } = props;

  const [selectedItem, setSelectedItem] = useState<{
    index: number;
    value: WorkerRole | WorkerRoles;
  } | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);     // ← replaces bottomSheetRef
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // ← replaces Alert
  const [pendingDelete, setPendingDelete] = useState<{ index: number; source: string; item: any } | null>(null);

  const WorkerRoleService = useWorkerRoleService();

  const handleEdit = (index: number, value: WorkerRole | WorkerRoles) => {
    setSelectedItem({ index, value });
    setEditDialogOpen(true);   // ← replaces workerRoleBottomSheetRef.current?.open()
  };

  const handleDeleteClick = async (index: number, source: string, item: any) => {
    if (source === "update" && item.id) {
      const isInUse = await WorkerRoleService.getWorkerRoleUsage(item.id);
      if (isInUse === true) {
        toast.error("This worker role is currently in use and cannot be deleted.");
        return;
      }
    }
    setPendingDelete({ index, source, item });
    setDeleteDialogOpen(true);  // ← replaces Alert.alert
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { index, source, item } = pendingDelete;

    if (source === "new") {
      const updated = [...(workerRoleList || [])];
      updated.splice(index, 1);
      setWorkerRoleList(updated);
    } else if (source === "update" && updateworkerRoleList && setUpdateWorkerRoleList) {
      const updated = [...(updateworkerRoleList || [])];
      updated.splice(index, 1);
      setUpdateWorkerRoleList(updated);
      if (deleteworkerRoleList && setDeleteWorkerRoleList && item.id) {
        setDeleteWorkerRoleList([...deleteworkerRoleList, item.id]);
      }
    }

    setPendingDelete(null);
    setDeleteDialogOpen(false);
  };

  return {
    selectedItem,
    handleDeleteClick,
    confirmDelete,
    handleEdit,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
};