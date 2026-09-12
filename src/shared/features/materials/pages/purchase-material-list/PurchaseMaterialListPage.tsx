import React from "react";
import { Trash2 } from "lucide-react";
import { usePermission } from "@/shared/hooks/usePermission";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { usePurchaseMaterialList } from "./usePurchaseMaterialList";
import PurchaseMaterialsEditScreen from "../purchase-material-edit/PurchaseMaterialEditPage";
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from "../../DTOs/PurchaseMaterialProps";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface Props {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<
    React.SetStateAction<PurchaseMaterialCreationListProps[]>
  >;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<
    React.SetStateAction<PurchaseMaterialUpdationListProps[]>
  >;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<
    React.SetStateAction<number[]>
  >;
}

const PurchaseMaterialsList: React.FC<Props> = ({
  newPurchaseMaterials,
  setNewPurchaseMaterials,
  updatedPurchaseMaterials,
  setUpdatedPurchaseMaterials,
  removedPurchaseMaterialIds,
  setRemovedPurchaseMaterialIds,
}) => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit("Purchase");

  const {
    selectedItem,
    setSelectedItem,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogItem,
    setDeleteDialogItem,
    handleEdit,
    confirmDelete,
    handleDelete,
  } = usePurchaseMaterialList({
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials,
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds,
    setRemovedPurchaseMaterialIds,
  });

  const combinedList = [
    ...(newPurchaseMaterials || []).map((item) => ({
      value: item,
      source: "new" as const,
    })),
    ...(updatedPurchaseMaterials || []).map((item) => ({
      value: item,
      source: "update" as const,
    })),
  ];

  if (combinedList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        {t("No materials added yet.")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {combinedList.map((itemWrapper, index) => {
        const item = itemWrapper.value;
        const key =
          "purchaseMaterialId" in item && item.purchaseMaterialId
            ? item.purchaseMaterialId
            : index;

        // ✅ Use receivedQuantity for display and total calculation
        const receivedQty =
          item.receivedQuantity != null && item.receivedQuantity !== ""
            ? parseFloat(item.receivedQuantity)
            : null;
        const rate =
          item.rate != null && item.rate !== ""
            ? parseFloat(item.rate)
            : null;
        const totalAmount =
          receivedQty !== null &&
          rate !== null &&
          !isNaN(receivedQty) &&
          !isNaN(rate)
            ? (receivedQty * rate).toFixed(2)
            : null;

        return (
          <div
            key={key}
            onClick={() => editable && handleEdit(item)}
            className={`rounded-xl border transition-shadow ${editable ? "cursor-pointer hover:shadow-sm" : "cursor-default"}`}
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Top — Material name + Delete */}
            <div
              className="flex items-center justify-between px-4 pt-3 pb-2 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="font-bold text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {item.material?.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(item);
                }}
                disabled={!editable}
                className="p-1 rounded-md hover:bg-destructive/10 transition-colors"
                style={{
                  opacity: editable ? 1 : 0.5,
                  cursor: editable ? "pointer" : "not-allowed",
                }}
              >
                <Trash2 className="w-4 h-4" style={{ color: 'var(--danger-color)' }} />
              </button>
            </div>

            {/* Middle — Received Quantity | Rate */}
            <div
              className="grid grid-cols-2 divide-x px-0 py-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col gap-0.5 px-4 py-1">
                <span className="text-xs text-muted-foreground">
                  {t("Received Quantity")}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.receivedQuantity || "—"}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {item.material?.unit?.name}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-0.5 px-4 py-1">
                <span className="text-xs text-muted-foreground">{t("Rate")}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.rate ? `₹${item.rate}` : "—"}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {item.rate ? `/${item.material?.unit?.name}` : ""}
                  </span>
                </span>
              </div>
            </div>

            {/* Bottom — Total Amount */}
            <div
              className="flex items-center justify-between px-4 py-2 rounded-b-xl border-t"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--muted)",
              }}
            >
              <span className="text-xs text-muted-foreground">
                Total amount
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {totalAmount !== null ? `₹${totalAmount}` : "—"}
              </span>
            </div>
          </div>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Edit Purchase Material")}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <PurchaseMaterialsEditScreen
              selectedItem={selectedItem}
              newPurchaseMaterials={newPurchaseMaterials}
              setNewPurchaseMaterials={setNewPurchaseMaterials}
              updatedPurchaseMaterials={updatedPurchaseMaterials}
              setUpdatedPurchaseMaterials={setUpdatedPurchaseMaterials}
              removedPurchaseMaterialIds={removedPurchaseMaterialIds}
              setRemovedPurchaseMaterialIds={setRemovedPurchaseMaterialIds}
              closeModal={() => {
                setEditDialogOpen(false);
                setSelectedItem(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteDialogItem}
        onOpenChange={(val) => !val && setDeleteDialogItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogItem(null)}>
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseMaterialsList;
