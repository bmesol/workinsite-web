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
import { FormInput } from "../FormInput/FormInput";
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
  console.log("role value:", selectedValue, "items:", items.map(i => i.value));

  return (
    <FormInput errorMessage={errorMessage}>
      {/* Label — same style as NameField */}
      <Label className="mb-1 text-base font-medium text-black flex items-center gap-0.5">
        {label || t("Role")}
        {required && (
          <span className="text-red-500 text-base leading-none">*</span>
        )}
      </Label>

      {/* Trigger input — click opens dialog, same as mobile TouchableOpacity */}
      <Input
        type="text"
        readOnly
        value={selectedItem ? selectedItem.label : ""}
        placeholder={t("Select Role")}
        onClick={() => setOpen(true)}
        className={cn("w-full cursor-pointer caret-transparent")}
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "var(--font-sm)",
        }}
      />

      {/* Dialog — shows full role list, same as mobile Modal + FlatList */}
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
            className="flex flex-col gap-3"
          />

          {/* Cancel — same as mobile CANCEL text */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 self-end text-sm font-semibold text-primary"
          >
            {t("Cancel").toUpperCase()}
          </button>
        </DialogContent>
      </Dialog>
    </FormInput>
  );
};

export { RoleSelectField };