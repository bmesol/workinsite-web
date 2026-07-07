import { useWorkTypeList } from "./useWorkTypeList";
import WorkTypeEditForm from "../../components/WorkTypeEditForm/WorkTypeEditForm";
import type { WorkTypeListProps } from "../../DTOs/WorkTypeProps";
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
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkTypeList = (props: WorkTypeListProps) => {
  const { t } = useLanguage();
  const {
    workTypeList,
    setWorkTypeList,
    updatedWorkTypeList,
    setUpdatedWorkTypeList,
    deletedWorkTypeList,
    setDeletedWorkTypeList,
  } = props;

  const {
    handleDeleteClick,
    confirmDelete,
    handleEdit,
    selectedItem,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useWorkTypeList(props);

  const combinedList = [
    ...(workTypeList || []).map((item: any, index) => ({
      name: typeof item === "string" ? item : item.name,
      index,
      source: "new",
    })),
    ...(updatedWorkTypeList || []).map((item, index) => ({
      ...item,
      index,
      source: "update",
    })),
  ];

  return (
    <div className="flex flex-col gap-2">

      {combinedList.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className={`flex items-center justify-between px-3 py-2 rounded-md border text-sm ${
            item.source === "new" ? "bg-green-100" : "bg-white"
          }`}
        >
          <span className="flex-1 truncate">{item.name}</span>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleEdit(item.index, item, item.source)}
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
            <DialogTitle>{t('Edit Work Type')}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <WorkTypeEditForm
              workTypeList={workTypeList}
              setWorkTypeList={setWorkTypeList}
              onClose={() => setEditDialogOpen(false)}
              selectedItem={selectedItem}
              updatedWorkTypeList={updatedWorkTypeList}
              setUpdatedWorkTypeList={setUpdatedWorkTypeList}
              deletedWorkTypeList={deletedWorkTypeList}
              setDeletedWorkTypeList={setDeletedWorkTypeList}
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
              Are you sure you want to delete this work type?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                {t('Cancel')}
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

export default WorkTypeList;
