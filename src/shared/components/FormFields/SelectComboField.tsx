import { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Check, ChevronDown, ChevronUp, ChevronsUpDown, Plus } from "lucide-react";
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
import { cn } from "@/shared/components/lib/utils";
import { useLanguage } from "@/shared/hooks/useLanguageContext";

interface SelectComboFieldProps {
  label?: string;
  id?: string;
  items: { label: string; value: string | number }[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  /** true → searchable Popover+Command (ComboboxField); false → plain dropdown (SelectField) */
  searchable?: boolean;
  onSearch?: (val: string) => void;
  onCreate?: (val: string) => void;
  listClassName?: string;
  className?: string;
}

const SelectComboField = ({
  label,
  id,
  items,
  selectedValue,
  onValueChange,
  placeholder,
  isDisabled = false,
  required = false,
  errorMessage,
  searchable = false,
  onSearch,
  onCreate,
  listClassName,
  className,
}: SelectComboFieldProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const selectedLabel = items.find((i) => i.value === selectedValue)?.label;

  const scrollToSelected = () => {
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLElement>('[data-selected-item="true"]')
        ?.scrollIntoView({ block: "nearest" });
    });
  };

  const labelNode = label ? (
    <Label
      htmlFor={id}
      className="text-base font-medium flex items-center gap-0.5"
      style={{ color: "var(--foreground)" }}
    >
      {label}
      {required && <span className="text-red-500 text-base leading-none">*</span>}
    </Label>
  ) : null;

  if (searchable) {
    return (
      <div className="flex flex-col gap-1.5">
        {labelNode}

        <Popover
          open={isOpen}
          onOpenChange={(val) => {
            if (isDisabled) return;
            setIsOpen(val);
            if (val) {
              onSearch?.("");
              scrollToSelected();
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              disabled={isDisabled}
              className={cn(
                "w-full justify-between font-normal text-sm bg-white dark:bg-background",
                isDisabled && "bg-gray-100 dark:bg-neutral-800 disabled:opacity-75",
                className,
              )}
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "var(--font-sm)",
                color: selectedLabel ? "var(--foreground)" : "var(--gray-color)",
              }}
            >
              {selectedLabel ?? `${t("Select")}...`}
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
                placeholder={t("Search...")}
                value={searchValue}
                onValueChange={(val) => {
                  setSearchValue(val);
                  onSearch?.(val);
                }}
              />
              <CommandList
                ref={listRef}
                className={cn("max-h-[160px] overflow-y-auto", listClassName)}
              >
                <CommandEmpty>
                  <span className="text-sm text-muted-foreground">
                    {t("No items found.")}
                  </span>
                </CommandEmpty>
                <CommandGroup className="flex flex-col gap-1 px-0 py-1">
                  {items.map((item) => {
                    const isSelected = selectedValue === item.value;
                    return (
                      <CommandItem
                        key={item.value}
                        value={String(item.value)}
                        data-selected-item={isSelected ? "true" : undefined}
                        onSelect={(val) => {
                          onValueChange(val);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1.5 min-h-9 leading-tight rounded-none cursor-pointer justify-between transition-opacity active:opacity-60",
                          "text-[var(--gray-color)]",
                          // unselected: half-strength hover so it never looks like the selected row
                          "data-[selected=true]:bg-[color-mix(in_srgb,var(--select-hover-bg)_50%,transparent)] data-[selected=true]:text-[var(--gray-color)]",
                          isSelected && [
                            "bg-[var(--select-hover-bg)] font-semibold text-[var(--secondary)]",
                            // keep selected appearance even when cmdk highlights it via keyboard
                            "data-[selected=true]:bg-[var(--select-hover-bg)] data-[selected=true]:text-[var(--secondary)]",
                          ],
                        )}
                      >
                        <span>{item.label}</span>
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0 text-primary",
                            !isSelected && "invisible",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>

                {onCreate && (
                  <div className="border-t p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1.5 justify-start text-primary"
                      onClick={() => {
                        onCreate(searchValue);
                        setIsOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {t("Create new")} {(label ?? "").toLowerCase()}
                    </Button>
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
    );
  }

  // searchable=false: plain dropdown (original SelectField behavior)
  return (
    <div className="flex flex-col gap-1.5">
      {labelNode}

      <Button
        type="button"
        variant="outline"
        role="combobox"
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            if (!isOpen) scrollToSelected();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "w-full justify-between font-normal bg-white text-sm",
          !selectedLabel && "text-muted-foreground",
          isDisabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-primary",
        )}
      >
        {selectedLabel ?? (placeholder ?? t("Select"))}
        {isOpen
          ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          : <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        }
      </Button>

      {isOpen && (
        <div
          ref={listRef}
          className="w-full rounded-md border border-border shadow-md z-50 max-h-[150px] overflow-y-auto animate-in fade-in-0 zoom-in-95 flex flex-col gap-1 py-1"
          style={{ backgroundColor: "var(--card)" }}
        >
          {items.map((item) => {
            const isSelected = item.value === selectedValue;
            return (
              <div
                key={item.value}
                data-selected-item={isSelected ? "true" : undefined}
                onClick={() => { onValueChange(item.value); setIsOpen(false); }}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 min-h-9 leading-tight text-sm cursor-pointer rounded-none transition-opacity active:opacity-60",
                  "text-[var(--gray-color)]",
                  // unselected hover: half-strength so it stays visibly lighter than the selected row
                  "hover:bg-[color-mix(in_srgb,var(--select-hover-bg)_50%,transparent)]",
                  isSelected && "bg-[var(--select-hover-bg)] font-semibold text-[var(--secondary)] hover:bg-[var(--select-hover-bg)]",
                )}
              >
                <span>{item.label}</span>
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0 text-primary",
                    !isSelected && "invisible",
                  )}
                />
              </div>
            );
          })}
        </div>
      )}

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export { SelectComboField };
export type { SelectComboFieldProps };
