import { X } from "lucide-react";
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
        <div className="bg-white px-6 pt-5 pb-2 pr-12">
          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle className="text-xl font-semibold text-black">
              {title ?? t("Confirm Delete")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex-row justify-end gap-3 space-x-0 bg-white px-6 pt-0 pb-4">
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
            <Button className="cursor-pointer" onClick={onConfirm}>
              {t("Delete")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteConfirmDialog };
