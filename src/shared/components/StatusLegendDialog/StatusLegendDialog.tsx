import { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface StatusLegendDialogProps {
  title: string;
  ariaLabel: string;
  items: ReadonlyArray<{ key: string; labelKey: string; color: string }>;
}

const StatusLegendDialog = ({ title, ariaLabel, items }: StatusLegendDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className="rounded-full p-1 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[280px] bg-white dark:bg-neutral-900 rounded-xl p-5">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span>{t(item.labelKey)}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { StatusLegendDialog };
