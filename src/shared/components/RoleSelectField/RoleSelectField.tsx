import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { RadioField } from "@/shared/components/FormFields/RadioField";
import { cn } from "@/shared/components/lib/utils";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface RoleItem {
  label: string;
  value: string;
}

interface RoleSelectFieldProps {
  label?: string;
  items: RoleItem[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  errorMessage?: string;
}

const RoleSelectField = ({
  label,
  items,
  selectedValue,
  onValueChange,
  required,
  errorMessage,
}: RoleSelectFieldProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((i) => i.value === selectedValue);

  return (
    <div className="w-full">
      {label && (
        <Label className="mb-2 block text-base font-semibold text-foreground">
          {label}
          {required && (
            <span className="text-[var(--danger-color)] ml-0.5">*</span>
          )}
        </Label>
      )}

      {/* Trigger input - shadcn Input, no default value */}
      <Input
        readOnly
        value={selectedItem ? selectedItem.label : ""}
        placeholder={t("Select role...")}
        onClick={() => setOpen(true)}
        className={cn(
          "h-12 cursor-pointer caret-transparent",
          errorMessage && "border-[var(--danger-color)]",
        )}
      />

      {errorMessage && (
        <p className="mt-1 text-sm text-[var(--danger-color)]">
          {errorMessage}
        </p>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Select Role")}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("Choose a role for the user")}
            </DialogDescription>
          </DialogHeader>

          <RadioField
            items={items}
            inputValue={selectedValue || ""}
            setInputValue={(value: string) => {
              onValueChange(value);
              setOpen(false);
            }}
            className="flex flex-col gap-3 [&_[data-state=checked]]:border-primary [&_[data-state=checked]]:bg-primary"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { RoleSelectField };
