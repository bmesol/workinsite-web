import { useEffect, useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { formatDateToString, formatStringToDate } from '@/shared/features/attendance/utils/functions';
import { cn } from '@/shared/components/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type DateFieldProps = {
  date: string;
  onDateChange: (formattedDate: string) => void;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  defaultDate?: boolean;
  disable?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

const DatePicker = ({
  date,
  onDateChange,
  errorMessage,
  label,
  required = false,
  defaultDate = false,
  disable = false,
  minDate = new Date(2020, 0, 1),
  maxDate = new Date(),
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);

  // Set today as default on mount
  useEffect(() => {
    if (!date && defaultDate) {
      onDateChange(formatDateToString(new Date()));
    }
  }, []);

  // Convert dd/mm/yyyy string → Date object
  const toDateObject = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const parsed = formatStringToDate(dateStr);
    return parsed || undefined;
  };

  // Convert Date object → dd/mm/yyyy string
  const fromDateObject = (d: Date): string => {
    return formatDateToString(d);
  };

  const selectedDate = toDateObject(date);

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <Label
          className="text-base font-medium flex items-center gap-0.5"
          style={{ color: 'var(--foreground)' }}
        >
          {label}
          {required && (
            <span className="text-red-500 text-base leading-none">*</span>
          )}
        </Label>
      )}

      {/* Calendar Popover */}
      <Popover open={open} onOpenChange={disable ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disable}
            className={cn(
              'w-full justify-start font-normal bg-white dark:bg-background',
              !selectedDate && 'text-muted-foreground',
              disable && 'opacity-50 cursor-not-allowed',
            )}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'var(--font-sm)',
              color: selectedDate ? 'var(--foreground)' : 'var(--gray-color)',
            }}
          >
            <CalendarIcon
              className="mr-2 h-4 w-4"
              style={{ color: 'var(--gray-color)' }}
            />
            {selectedDate
              ? format(selectedDate, 'dd-MM-yyyy')  // display format
              : 'Select date'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white dark:bg-background" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                onDateChange(fromDateObject(d));
                setOpen(false);
              }
            }}
            disabled={(d) => d < minDate || d > maxDate}
          />
        </PopoverContent>
      </Popover>

      {/* Error */}
      {!disable && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

    </div>
  );
};

export { DatePicker };
export type { DateFieldProps as DatePickerProps };