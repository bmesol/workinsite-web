import { Header } from "@/shared/components/Header/Header";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { UnitList } from "../unit-list/UnitListPage";
import { useUnitCreation } from "./useUnitCreation";
import { usePermission } from "@/shared/hooks/usePermission";
import { Loader2 } from "lucide-react";
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
import { NameField } from "@/shared/components/FormFields/NameField";

const UnitCreationPage = () => {
  const { canEdit } = usePermission();
  const editable = canEdit("Unit");

  const {
    name,
    unitDetails,
    loading,
    isEditing,
    error,
    editingUnitId,
    deleteId,
    setDeleteId,
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleUnitUpdate,
    handleUnitDelete,
    confirmDelete,
    setEditingUnit,
  } = useUnitCreation();

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      {/* Header */}
      <Header title="Create Unit" />

      <Card className="mt-4">
        <CardContent className="pt-6 flex flex-col gap-4">
          {/* Input */}
         <NameField
  label="Unit"
  inputValue={name}
  setInputValue={setName}
  errorMessage={error.name}
  placeholder="Enter unit"
  required
  isDisabled={!editable}
/>
          {/* Save / Update + Cancel Buttons */}
          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                className="w-24"
                onClick={resetFormFields}
                disabled={!editable}
              >
                Cancel
              </Button>
            )}
            <Button
              className="w-24"
              onClick={isEditing ? handleUnitUpdate : handleSubmission}
              disabled={!editable}
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>

          {/* Unit List Title */}
          <p className="text-base font-medium text-foreground">Unit List</p>

          {/* Loader / List */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2
                className="animate-spin"
                style={{ color: "var(--secondary)" }}
                size={28}
              />
            </div>
          ) : (
            <UnitList
              unitDetails={unitDetails}
              handleUnitDelete={confirmDelete} 
              handleUnitEdit={setEditingUnit}
              editingUnitId={editingUnitId}
            />
          )}
        </CardContent>
      </Card>

      {/* ✅ Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this unit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleUnitDelete(deleteId)}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { UnitCreationPage };
