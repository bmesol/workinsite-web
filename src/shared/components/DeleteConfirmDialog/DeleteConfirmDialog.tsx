import { X, Trash2 } from "lucide-react";
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
import { Button } from "@/shared/components/ui/button";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description: string;
  title?: string;
}

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  description,
  title,
}: DeleteConfirmDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl">
        {/* Close (X) button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 h-auto w-auto rounded-full border-0 bg-transparent p-1 text-gray-600 transition hover:[color:var(--danger-color)]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top section */}
        <div className="flex items-stretch gap-4 bg-white px-6 py-5">
          <div className="flex shrink-0 items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-200">
              <Trash2 className="h-6 w-6 text-black" />
            </div>
          </div>

          <div className="w-px self-stretch bg-gray-200" />

          <AlertDialogHeader className="space-y-1 pr-6 text-left">
            <AlertDialogTitle className="text-xl font-semibold text-black">
              {title ?? t("Confirm Delete")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex-row justify-end gap-3 space-x-0 border-t border-gray-200 bg-white px-6 py-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              {t("Cancel")}
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              className="cursor-pointer"
              onClick={onConfirm}
            >
              {t("Delete")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteConfirmDialog };
