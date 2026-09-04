import { useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  formatDateToString,
  formatStringToDate,
} from '@/shared/features/attendance/utils/functions';
import { cn } from '@/shared/components/lib/utils';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { format, addMonths, startOfMonth, setYear } from 'date-fns';

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
  className?: string;
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
  className,
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const toDateObject = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    return formatStringToDate(dateStr) || undefined;
  };

  // Committed value (drives the trigger label). Only changes on OK.
  const committedDate = toDateObject(date);

  // Draft selection while the popover is open — committed only on OK.
  const [draftDate, setDraftDate] = useState<Date | undefined>(committedDate);

  // Month/year currently shown in the calendar grid.
  const [viewMonth, setViewMonth] = useState<Date>(
    () => committedDate ?? new Date(),
  );

  // Set today as default on mount.
  useEffect(() => {
    if (!date && defaultDate) {
      onDateChange(formatDateToString(new Date()));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On open: seed draft + view from the committed value, reset to grid view.
  useEffect(() => {
    if (open) {
      const parsed = date ? formatStringToDate(date) : null;
      setDraftDate(parsed || undefined);
      setViewMonth(parsed || new Date());
      setShowYearPicker(false);
    }
  }, [open, date]);

  // Year list bounds.
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear],
  );

  const currentDisplayYear = viewMonth.getFullYear();
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the highlighted year into view when the year list opens.
  useEffect(() => {
    if (!showYearPicker) return;
    const timer = setTimeout(() => {
      selectedYearRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'auto',
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [showYearPicker]);

  const clampDate = (d: Date): Date =>
    d < minDate ? minDate : d > maxDate ? maxDate : d;

  const clampMonth = (d: Date): Date => {
    const lo = startOfMonth(minDate);
    const hi = startOfMonth(maxDate);
    if (d < lo) return lo;
    if (d > hi) return hi;
    return d;
  };

  const handleYearSelect = (year: number) => {
    if (draftDate) {
      const moved = clampDate(setYear(draftDate, year));
      setDraftDate(moved);
      setViewMonth(startOfMonth(moved));
    } else {
      setViewMonth(clampMonth(new Date(year, viewMonth.getMonth(), 1)));
    }
    setShowYearPicker(false);
  };

  const atMinMonth = startOfMonth(viewMonth) <= startOfMonth(minDate);
  const atMaxMonth = startOfMonth(viewMonth) >= startOfMonth(maxDate);
  const goToMonth = (delta: number) =>
    setViewMonth((m) => clampMonth(addMonths(m, delta)));

  const handleCancel = () => setOpen(false);
  const handleOk = () => {
    if (draftDate) onDateChange(formatDateToString(draftDate));
    setOpen(false);
  };

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
      <Popover
        open={open}
        onOpenChange={
          disable
            ? undefined
            : (o) => {
                setOpen(o);
                if (!o) setShowYearPicker(false);
              }
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disable}
            className={cn(
              'w-full justify-start font-normal bg-white dark:bg-background',
              !committedDate && 'text-muted-foreground',
              disable && 'bg-gray-100 dark:bg-neutral-800 disabled:opacity-75',
              className,
            )}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'var(--font-sm)',
              color: committedDate ? 'var(--foreground)' : 'var(--gray-color)',
            }}
          >
            <CalendarIcon
              className="mr-2 h-4 w-4"
              style={{ color: 'var(--gray-color)' }}
            />
            {committedDate ? format(committedDate, 'dd-MM-yyyy') : 'Select date'}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[268px] overflow-hidden p-0 bg-white dark:bg-background"
          align="start"
        >
          <div className="flex flex-col max-h-[480px]">
            {/* Header band — selected date (mirrors mobile) */}
            <div className="bg-primary px-4 pt-3 pb-4 text-primary-foreground shrink-0">
              <div className="text-xs font-medium opacity-80">
                {draftDate ? format(draftDate, 'yyyy') : 'Date'}
              </div>
              <div className="text-2xl font-semibold leading-tight">
                {draftDate ? format(draftDate, 'EEE, d MMM') : 'Select date'}
              </div>
            </div>

            {/* Month/year toggle + month nav */}
            <div className="bg-white dark:bg-background flex items-center px-3 pt-2 shrink-0">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                disabled={atMinMonth}
                aria-label="Previous month"
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  showYearPicker && 'invisible',
                )}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowYearPicker((v) => !v)}
                aria-label="Toggle year selection"
                className="flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ color: 'var(--foreground)' }}
              >
                {format(viewMonth, 'MMMM yyyy')}
                {showYearPicker ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              <button
                type="button"
                onClick={() => goToMonth(1)}
                disabled={atMaxMonth}
                aria-label="Next month"
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  showYearPicker && 'invisible',
                )}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Body: year column OR calendar grid — scrollable only here */}
            <div className="flex-1 overflow-y-auto">
              {showYearPicker ? (
                <div className="py-1">
                  {years.map((year) => {
                    const isCurrent = year === currentDisplayYear;
                    return (
                      <button
                        key={year}
                        ref={isCurrent ? selectedYearRef : undefined}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        aria-pressed={isCurrent}
                        className={cn(
                          'w-full py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                          isCurrent
                            ? 'text-lg font-semibold text-primary'
                            : 'text-base text-foreground/70 hover:text-foreground',
                        )}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-2">
                  <Calendar
                    mode="single"
                    selected={draftDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    startMonth={minDate}
                    endMonth={maxDate}
                    onSelect={(d) => {
                      if (d) setDraftDate(d);
                    }}
                    disabled={(d) => d < minDate || d > maxDate}
                    // We render our own header above; hide RDP's.
                    hideNavigation
                    className="p-0 [--cell-size:--spacing(7)]"
                    classNames={{ day_button: 'text-xs', month_caption: 'hidden' }}
                    components={{ MonthCaption: () => <></> }}
                  />
                </div>
              )}
            </div>

            {/* Footer: CANCEL / OK */}
            <div className="flex items-center justify-end gap-1 border-t border-border px-2 py-2 shrink-0">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded px-2 py-1 text-xs font-medium uppercase tracking-wide text-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOk}
                disabled={!draftDate}
                className="rounded px-2 py-1 text-xs font-medium uppercase tracking-wide text-primary hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                OK
              </button>
            </div>
          </div>
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