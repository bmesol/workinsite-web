import { Header } from "@/shared/components/Header/Header";
import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useShiftCreation } from "./useShiftCreation";
import { ShiftListPage } from "../shift-list/ShiftListPage";
import { usePermission } from "@/shared/hooks/usePermission";
import { DeleteConfirmDialog } from "@/shared/components/DeleteConfirmDialog/DeleteConfirmDialog";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ShiftCreationPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit("Shift");

  const {
    name,
    multiplier,
    shiftDetails,
    loading,
    isEditing,
    error,
    editingShiftId,
    isLoading,
    deleteId,
    setName,
    setMultiplier,
    resetFormFields,
    handleSubmission,
    handleUpdate,
    handleShiftDelete,
    confirmDelete,
    cancelDelete,
    setEditingShift,
    handleRefresh,
    isFixedMultiplier,
  } = useShiftCreation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate();
    } else {
      handleSubmission();
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title={t('Shift')} />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4 ">

          {/* Form with keyboard submit support */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">

            {/* Shift Name Input */}
            <NameField
              label={t('Shift')}
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              placeholder={t('Enter Shift')}
              required
              isDisabled={!editable}
            />

            {/* Multiplier Input */}
            <NameField
              label="Multiplier (00.00)"
              inputValue={multiplier}
              setInputValue={setMultiplier}
              errorMessage={error.multiplier}
              placeholder="Enter Multiplier"
              required
              isDisabled={!editable || isFixedMultiplier}
              regex="^[0-9.]*$"
            />

            {/* Save / Update + Cancel Buttons — right-aligned, fixed width */}
            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-24"
                  onClick={resetFormFields}
                  disabled={!editable}
                >
                  {t('Cancel')}
                </Button>
              )}
              <Button
                type="submit"
                className="w-24"
                disabled={!editable}
              >
                {isEditing ? t('Update') : t('Save')}
              </Button>
            </div>

          </form>

          {/* Shift List */}
          <div>
            <h2 className="text-base font-medium text-black mb-3">
              {t('Shift List')}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : (
              <ShiftListPage
                shiftDetails={shiftDetails ?? []}
                handleShiftDelete={handleShiftDelete}
                handleShiftEdit={setEditingShift}
                editingShiftId={editingShiftId}
                isLoading={isLoading}
                handleRefresh={handleRefresh}
              />
            )}
          </div>

        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        description={t('Are you sure you want to delete this shift? This action cannot be undone.')}
      />
    </div>
  );
};

export { ShiftCreationPage };
