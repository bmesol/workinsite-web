import type { Dispatch, SetStateAction } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { ComboboxField } from '@/shared/components/FormFields/ComboBoxField';
import { DateFilter } from '../DateFilter/DateFilter';
import type { DateRange, DateRangeOption, SelectOption } from '../../DTOs/WorkerreportProps';

interface InventoryFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: SelectOption;
  setSite: (site: SelectOption) => void;
  siteSelectOptions: SelectOption[];
  fetchSites: (text: string) => void;
  selectedOption: DateRangeOption;
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  handleDateOptionChange: (option: DateRangeOption) => void;
  errors: { fromDate: string; toDate: string };
  handleSearch: () => void;
}

export function InventoryFilterDialog({
  open,
  onOpenChange,
  site,
  setSite,
  siteSelectOptions,
  fetchSites,
  selectedOption,
  dateRange,
  setDateRange,
  handleDateOptionChange,
  errors,
  handleSearch,
}: InventoryFilterDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md bg-white dark:bg-[var(--card)] flex flex-col max-h-[80vh]">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>Filter Inventory Report</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Filter by site and date range
          </AlertDialogDescription>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-0 right-0 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
          <div className="space-y-1.5">
            <ComboboxField
              id="site"
              label="Site"
              items={[{ label: 'All Sites', value: '' }, ...siteSelectOptions]}
              selectedValue={site.value}
              onValueChange={(val) => {
                if (val === '') {
                  setSite({ label: '', value: '' });
                } else {
                  const found = siteSelectOptions.find((s) => s.value === val);
                  setSite({ label: found?.label ?? '', value: val });
                }
              }}
              onSearch={(val) => fetchSites(val)}
            />
            {site.value && (
              <button
                type="button"
                onClick={() => setSite({ label: '', value: '' })}
                className="text-blue-600 hover:underline"
                style={{ fontSize: 'var(--font-xs)' }}
              >
                Clear site (show all sites)
              </button>
            )}
          </div>

          <DateFilter
            selectedOption={selectedOption}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onOptionChange={handleDateOptionChange}
            errors={errors}
          />
        </div>

        <AlertDialogFooter className="pt-2">
          <AlertDialogAction asChild>
            <Button
              className="w-full h-12 font-semibold"
              style={{ fontSize: 'var(--font-md)' }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
