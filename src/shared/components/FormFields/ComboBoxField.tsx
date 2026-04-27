import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
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
}: ComboboxFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedLabel = items.find((i) => i.value === selectedValue)?.label;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-base font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Popover
        open={open}
        onOpenChange={(val) => {
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
            className={cn(
              "w-full justify-between font-normal bg-white",
              !selectedLabel && "text-muted-foreground",
            )}
          >
            {selectedLabel ?? `Select ${label.toLowerCase()}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchValue}
              onValueChange={(val) => {
                setSearchValue(val);
                onSearch(val);
              }}
            />
            <CommandList>
              <CommandEmpty>
                <span className="text-sm text-muted-foreground">
                  No {label.toLowerCase()} found.
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
                  Create new {label.toLowerCase()}
                </Button>
              </div>
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
