import { useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
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
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfDay,
  endOfDay,
  setYear,
} from 'date-fns';

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

// Reference-design tokens
const BRAND_YELLOW = '#F5C720';
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
// Year list height (≈ a 5-row month) — calendar grid itself sizes to its content
const YEAR_LIST_HEIGHT = 'h-[196px]';

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
  const yearListRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll the highlighted year to the middle when the year list opens.
  // Uses scrollTop on the list itself (not scrollIntoView) so it works reliably
  // inside the popover animation.
  useEffect(() => {
    if (!showYearPicker) return;
    const raf = requestAnimationFrame(() => {
      const list = yearListRef.current;
      const el = selectedYearRef.current;
      if (list && el) {
        list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
      }
    });
    return () => cancelAnimationFrame(raf);
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

  const isDayDisabled = (d: Date) =>
    d < startOfDay(minDate) || d > endOfDay(maxDate);

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

  const handleDayClick = (d: Date) => {
    if (isDayDisabled(d)) return;
    setDraftDate(d);
    // Clicking a leading/trailing day jumps to that month
    if (!isSameMonth(d, viewMonth)) setViewMonth(startOfMonth(d));
  };

  const atMinMonth = startOfMonth(viewMonth) <= startOfMonth(minDate);
  const atMaxMonth = startOfMonth(viewMonth) >= startOfMonth(maxDate);
  const goToMonth = (delta: number) =>
    setViewMonth((m) => clampMonth(addMonths(m, delta)));

  // All days shown in the grid (incl. leading / trailing days of neighbouring months)
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(viewMonth)),
        end: endOfWeek(endOfMonth(viewMonth)),
      }),
    [viewMonth],
  );

  const handleCancel = () => setOpen(false);
  const handleOk = () => {
    if (draftDate) onDateChange(formatDateToString(draftDate));
    setOpen(false);
  };

  const navBtn =
    'inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground hover:bg-black/5 dark:hover:bg-white/10 disabled:pointer-events-none disabled:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

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
              fontSize: 'var(--font-xs)',
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
          className="w-[260px] overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl dark:bg-background"
          align="start"
          collisionPadding={8}
          style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'var(--font-xs)' }}
        >
          <div className="flex flex-col">
            {/* Header band */}
            <div
              className="shrink-0 px-3 pt-2 pb-2.5 text-black"
              style={{ backgroundColor: BRAND_YELLOW }}
            >
              <div className="text-[length:var(--font-xs)] font-medium text-black/60">Date</div>
              <div className="text-[length:var(--font-sm)] font-semibold leading-tight">
                {draftDate ? format(draftDate, 'EEE, d MMM yyyy') : 'Select date'}
              </div>
            </div>

            {/* Month nav: arrows on the edges, month/year toggle centred */}
            <div className="flex shrink-0 items-center justify-between bg-white px-2.5 py-1.5 dark:bg-background">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                disabled={atMinMonth}
                aria-label="Previous month"
                className={cn(navBtn, showYearPicker && 'invisible')}
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowYearPicker((v) => !v)}
                aria-label="Toggle year selection"
                className="flex items-center gap-1.5 rounded-md px-2 py-0.5 !text-[length:var(--font-xs)] font-medium hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ color: 'var(--foreground)' }}
              >
                {format(viewMonth, 'MMMM yyyy')}
                {showYearPicker ? (
                  <ChevronUpIcon className="h-3 w-3" />
                ) : (
                  <ChevronDownIcon className="h-3 w-3" />
                )}
              </button>

              <button
                type="button"
                onClick={() => goToMonth(1)}
                disabled={atMaxMonth}
                aria-label="Next month"
                className={cn(navBtn, showYearPicker && 'invisible')}
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body: year list OR calendar grid (same fixed height) */}
            {showYearPicker ? (
              <div
                ref={yearListRef}
                className={cn('relative overflow-y-auto py-1', YEAR_LIST_HEIGHT)}
              >
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
                        'w-full py-1.5 text-center transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                        isCurrent
                          ? '!text-[length:var(--font-xs)] font-semibold text-foreground'
                          : '!text-[length:var(--font-xs)] text-foreground/60',
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                {/* Weekday strip */}
                <div className="grid h-6 grid-cols-7 items-center bg-gray-100/80 dark:bg-neutral-800">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[length:var(--font-xs)] font-normal text-foreground/70"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 px-1 py-1">
                  {days.map((d) => {
                    const disabled = isDayDisabled(d);
                    const selected = !!draftDate && isSameDay(d, draftDate);
                    const today = isSameDay(d, new Date());
                    return (
                      <div
                        key={d.toISOString()}
                        className="flex h-7 items-center justify-center"
                      >
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDayClick(d)}
                          aria-label={format(d, 'EEEE, d MMMM yyyy')}
                          aria-pressed={selected}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full !text-[length:var(--font-xs)] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            disabled
                              ? 'cursor-not-allowed text-gray-300 dark:text-neutral-600'
                              : 'text-foreground/85 hover:bg-black/5 dark:hover:bg-white/10',
                            today && !selected && 'ring-1 ring-inset ring-black/30',
                            selected &&
                              'font-medium text-black hover:brightness-95',
                          )}
                          style={
                            selected ? { backgroundColor: BRAND_YELLOW } : undefined
                          }
                        >
                          {format(d, 'd')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer: CANCEL / OK */}
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-3 py-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded px-2 py-0.5 !text-[length:var(--font-xs)] font-medium uppercase tracking-wide hover:bg-yellow-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ color: BRAND_YELLOW }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOk}
                disabled={!draftDate}
                className="rounded-md px-3 py-1 !text-[length:var(--font-xs)] font-medium uppercase text-black transition hover:brightness-95 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ backgroundColor: BRAND_YELLOW }}
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