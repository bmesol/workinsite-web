import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { useLanguage } from "@/shared/hooks/useLanguageContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/shared/components/lib/utils";

type ComboboxFieldProps = {
  id: string;
  label: string;
  items: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (val: string) => void;
  onSearch: (val: string) => void;
  onCreate?: (val: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const ComboboxField = ({
  id,
  label,
  items,
  selectedValue,
  onValueChange,
  onSearch,
  onCreate,
  error,
  required,
  disabled = false,
}: ComboboxFieldProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedLabel = items.find((i) => i.value === selectedValue)?.label;

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-base font-medium flex items-center gap-0.5"
        style={{ color: "var(--foreground)" }}
      >
        {label}
        {required && (
          <span className="text-red-500 text-base leading-none">*</span>
        )}
      </Label>

      <Popover
        open={open}
        onOpenChange={(val) => {
          if (disabled) return;
          setOpen(val);
          if (val) onSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal text-sm bg-white dark:bg-background",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "var(--font-sm)",
              color: selectedLabel ? "var(--foreground)" : "var(--gray-color)",
            }}
          >
            {selectedLabel ?? `${t('Select')}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 bg-white dark:bg-background z-[200]"
          align="start"
          collisionPadding={{ top: 72 }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={t('Search...')}
              value={searchValue}
              onValueChange={(val) => {
                setSearchValue(val);
                onSearch(val);
              }}
            />
            <CommandList>
              <CommandEmpty>
                <span className="text-sm text-muted-foreground">
                  {t('No items found.')}
                </span>
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(val) => {
                      onValueChange(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === item.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              {onCreate && (
                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 justify-start text-primary"
                    onClick={() => {
                      onCreate?.(searchValue);
                      setOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    {t('Create new')} {label.toLowerCase()}
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { ComboboxField };
export type { ComboboxFieldProps };
