import { Header } from "@/shared/components/Header/Header";
import { NameField } from "@/shared/components/FormFields/NameField";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useWorkModeCreation } from "./useWorkerModeCreation";
import { WorkModeList } from "../worker-mode-list/WorkerModeList";
import { usePermission } from "@/shared/hooks/usePermission";
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

const WorkModeCreationPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit("Work Mode");

  const {
    name,
    workModeDetails,
    loading,
    isEditing,
    error,
    editingWorkModeId,
    deleteId,
    setName,
    resetFormFields,
    handleSubmission,
    handleWorkModeUpdate,
    handleWorkModeDelete,
    confirmDelete,
    cancelDelete,
    setEditingWorkMode,
  } = useWorkModeCreation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      handleWorkModeUpdate();
    } else {
      handleSubmission();
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title={t('Work Mode')} />

      <Card className="mt-4">
        <CardContent className="flex flex-col gap-4 pt-4">

          {/* Form with keyboard submit support */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <NameField
              label={t('Work Mode')}
              inputValue={name}
              setInputValue={setName}
              errorMessage={error.name}
              placeholder={t('Enter work mode')}
              required
              isDisabled={!editable}
            />

            {/* Save / Update + Cancel buttons — right-aligned, auto width */}
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

          {/* Work Mode List */}
          <div>
            <h2 className="text-base font-medium text-black mb-3">
              {t('Work Mode List')}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : (
              <WorkModeList
                workModeDetails={workModeDetails ?? []}
                handleWorkModeDelete={handleWorkModeDelete}
                handleWorkModeEdit={setEditingWorkMode}
                editingWorkModeId={editingWorkModeId}
              />
            )}
          </div>

        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this work mode? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { WorkModeCreationPage };
