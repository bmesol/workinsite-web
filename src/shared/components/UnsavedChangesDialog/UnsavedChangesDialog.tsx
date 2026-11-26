import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface UnsavedChangesDialogProps {
  open: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

const UnsavedChangesDialog = ({
  open,
  onKeepEditing,
  onDiscard,
  onSave,
}: UnsavedChangesDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onKeepEditing()}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl">
        <div className="bg-white px-6 pt-5 pb-2 pr-12">
          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle className="text-xl font-semibold text-black">
              {t('Unsaved Changes')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              {t('You have unsaved changes. What would you like to do?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="flex-row justify-end gap-3 space-x-0 bg-white px-6 pt-0 pb-4">
          <Button
            variant="outline"
            className="cursor-pointer border-border bg-background text-foreground hover:bg-gray-100"
            onClick={onDiscard}
          >
            {t('Exit Without Saving')}
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer border-border bg-background text-foreground hover:bg-gray-100"
            onClick={onKeepEditing}
          >
            {t('Keep Editing')}
          </Button>
          <Button
            className="cursor-pointer bg-[var(--success-color)] hover:bg-[var(--success-color)]/90 text-white"
            onClick={onSave}
          >
            {t('Save')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { UnsavedChangesDialog };
