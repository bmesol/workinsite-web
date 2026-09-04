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
import { useState } from "react";
import { useSupervisorAddForm } from "./useSupervisorAddForm";
import type { SupervisorAddFormProps } from "./DTOs";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SupervisorAddForm = (props: SupervisorAddFormProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    supervisorDetails,
    supervisorId,
    handleSupervisorCreate,
    handleSupervisorChange,
    fetchSupervisors,
    handleAdd,
  } = useSupervisorAddForm(props);

  const selectedLabel = supervisorDetails.find(
    (s) => s.value === supervisorId
  )?.label;

  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchSupervisors(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="supervisor-combobox" className="text-base font-medium">
          {t('Supervisor')}
        </Label>

        <Popover
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (val) fetchSupervisors("");
          }}
        >
          <PopoverTrigger asChild>
            <Button
              id="supervisor-combobox"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between font-normal",
                !selectedLabel && "text-muted-foreground"
              )}
            >
              {selectedLabel ?? "Select supervisor..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0 bg-white" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search supervisor..."
                value={searchValue}
                onValueChange={handleSearch}
              />
              <CommandList className="max-h-[160px] overflow-y-auto">
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm ">
                      No supervisor found.
                    </span>
                  </div>
                </CommandEmpty>

                <CommandGroup>
                  {supervisorDetails.map((supervisor) => (
                    <CommandItem
                      key={supervisor.value}
                      value={supervisor.value}
                      onSelect={(val) => {
                        handleSupervisorChange(val);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          supervisorId === supervisor.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {supervisor.label}
                    </CommandItem>
                  ))}
                </CommandGroup>

                <div className="border-t p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-1.5 justify-start text-primary"
                    onClick={() => {
                      handleSupervisorCreate(searchValue);
                      setOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Create new supervisor
                  </Button>
                </div>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

      </div>

      <FormSubmissionButtons
  onCancel={() => props.onClose?.()}
  onSave={handleAdd}
/>
    </div>
  );
};

export { SupervisorAddForm };
