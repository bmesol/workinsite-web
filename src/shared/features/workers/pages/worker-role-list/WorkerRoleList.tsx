import { useWorkerRoleList } from "./useWorkerRoleList";
import WorkerRoleEditForm from "../../components/WorkerRoleEditForm/WorkerRoleEditForm";
import type { WorkerRoleListProps } from "../../DTOs/WorkRoleProps";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

const WorkerRoleList = (props: WorkerRoleListProps) => {
  const {
    workerRoleList,
    setWorkerRoleList,
    updateworkerRoleList,
    setUpdateWorkerRoleList,
    deleteworkerRoleList,
    setDeleteWorkerRoleList,
  } = props;

  const {
    selectedItem,
    handleDeleteClick,
    confirmDelete,
    handleEdit,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useWorkerRoleList(props);

  const combinedList = [
    ...(workerRoleList || []).map((item, index) => ({
      ...item,
      index,
      source: "new",
    })),
    ...(updateworkerRoleList || []).map((item, index) => ({
      ...item,
      index,
      source: "update",
    })),
  ];

  if (combinedList.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">

      {combinedList.map((item, combinedIndex) => (
        <div
          key={`${item.name}-${combinedIndex}`}
          className={`flex items-center justify-between px-3 py-2 rounded-md border text-sm ${
            item.source === "new" ? "bg-green-100" : "bg-white"  
          }`}
        >
          {/* Name */}
          <span className="flex-[3] truncate font-medium">{item.name}</span>

          {/* Salary */}
          <span className="flex-1 text-center">
            ₹{parseFloat(item.salaryPerShift).toLocaleString("en-IN")}
          </span>

          {/* Hours */}
          <span className="flex-1 text-center">{item.hoursPerShift}h</span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleEdit(item.index, item)}
            >
              <Pencil className="h-4 w-4 text-yellow-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDeleteClick(item.index, item.source, item)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}

      {/* Edit Dialog — replaces mobile BottomSheet */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Worker Role</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <WorkerRoleEditForm
              workerRoleList={workerRoleList}
              setWorkerRoleList={setWorkerRoleList}
              updateworkerRoleList={updateworkerRoleList}
              setUpdateWorkerRoleList={setUpdateWorkerRoleList}
              deleteworkerRoleList={deleteworkerRoleList}
              setDeleteWorkerRoleList={setDeleteWorkerRoleList}
              selectedItem={selectedItem}
              onClose={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog — replaces mobile Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this worker role?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default WorkerRoleList;