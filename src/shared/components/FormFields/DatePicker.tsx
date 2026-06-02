import { useEffect, useRef } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { formatDateToString, formatStringToDate } from '@/shared/features/attendance/utils/functions';
import { cn } from '@/shared/components/lib/utils';

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

  // Set today as default on mount
  useEffect(() => {
    if (!date && defaultDate) {
      onDateChange(formatDateToString(new Date()));
    }
  }, []);

  // Convert "DD/MM/YYYY" → "YYYY-MM-DD" for <input type="date">
  const toInputValue = (dateStr: string): string => {
    if (!dateStr) return '';
    const parsed = formatStringToDate(dateStr);
    if (!parsed) return '';
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Convert "YYYY-MM-DD" → "DD/MM/YYYY" for our app format
  const fromInputValue = (val: string): string => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  };

  // Convert Date → "YYYY-MM-DD" for min/max attributes
  const toMinMax = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <Label className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Date Input */}
      <Input
        type="date"
        value={toInputValue(date)}
        onChange={(e) => onDateChange(fromInputValue(e.target.value))}
        disabled={disable}
        min={toMinMax(minDate)}
        max={toMinMax(maxDate)}
        className={cn(
          'w-full',
          disable && 'opacity-50 cursor-not-allowed bg-gray-100',
        )}
      />

      {/* Error */}
      {!disable && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

    </div>
  );
};

export { DatePicker };
export type { DateFieldProps as DatePickerProps };