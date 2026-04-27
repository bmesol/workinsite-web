import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { DateRange, DateRangeOption } from '../../DTOs/WorkerreportProps';
import { toInputDate, fromInputDate } from '../../utils/DateUtils';

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
    ? 'bg-primary text-primary-foreground border-primary'  // ✅ was blue-600
    : 'bg-background text-slate-700 border-slate-200 hover:border-primary'  // ✅ was blue-300
}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom pickers */}
      {selectedOption === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-base font-medium mb-1 block">From Date</Label>
            <Input
              type="date"
              value={toInputDate(dateRange.from)}
              onChange={e =>
                setDateRange(prev => ({ ...prev, from: fromInputDate(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label className="text-base font-medium mb-1 block">To Date</Label>
            <Input
              type="date"
              value={toInputDate(dateRange.to)}
              onChange={e =>
                setDateRange(prev => ({ ...prev, to: fromInputDate(e.target.value) }))
              }
            />
          </div>
        </div>
      )}

      {/* Selected range display */}
      {selectedOption !== 'custom' && dateRange.from && dateRange.to && (
        <p className="text-xs text-slate-500  rounded-lg px-3 py-2 text-center">
          {dateRange.from} — {dateRange.to}
        </p>
      )}

      {/* Errors */}
      {(errors.fromDate || errors.toDate) && (
        <p className="text-xs text-red-500">{errors.fromDate || errors.toDate}</p>
      )}
    </div>
  );
}