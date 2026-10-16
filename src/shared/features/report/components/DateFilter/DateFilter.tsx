import { Label } from '@/shared/components/ui/label';
import { DatePicker } from '@/shared/components/FormFields/DatePicker';
import type { DateRange, DateRangeOption } from '../../DTOs/WorkerreportProps';

interface Props {
  selectedOption: DateRangeOption;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  onOptionChange: (opt: DateRangeOption) => void;
  errors: { fromDate: string; toDate: string };
}

const OPTIONS: { key: DateRangeOption; label: string }[] = [
  { key: 'lastWeek',    label: 'Last Week'  },
  { key: 'currentWeek', label: 'This Week'  },
  { key: 'custom',      label: 'Custom'     },
];

export function DateFilter({ selectedOption, dateRange, setDateRange, onOptionChange, errors }: Props) {
  return (
    <div className="space-y-3">
      <Label className='text-base font-medium'>
        Date Range <span className="text-red-500">*</span>
      </Label>

      {/* Quick buttons */}
      <div className="flex gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onOptionChange(opt.key)}
          className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
  selectedOption === opt.key
    ? 'bg-primary text-primary-foreground border-primary'
    : 'bg-background text-slate-700 border-slate-200 hover:border-primary'
}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom pickers */}
      {selectedOption === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="From Date"
            date={dateRange.from.replace(/-/g, '/')}
            onDateChange={(val) =>
              setDateRange(prev => ({ ...prev, from: val.replace(/\//g, '-') }))
            }
            errorMessage={errors.fromDate}
          />
          <DatePicker
            label="To Date"
            date={dateRange.to.replace(/-/g, '/')}
            onDateChange={(val) =>
              setDateRange(prev => ({ ...prev, to: val.replace(/\//g, '-') }))
            }
            errorMessage={errors.toDate}
          />
        </div>
      )}

      {/* Selected range display */}
      {selectedOption !== 'custom' && dateRange.from && dateRange.to && (
        <p className="text-xs text-slate-500  rounded-lg px-3 py-2 text-center">
          {dateRange.from} — {dateRange.to}
        </p>
      )}
    </div>
  );
}