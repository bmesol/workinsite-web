import { Users, IndianRupee } from 'lucide-react';
import { formatINR } from '../../utils/DateUtils';

interface Props {
  totalWorkers: number;
  totalAmount: number;
}

export function StatsBar({ totalWorkers, totalAmount }: Props) {
  return (
    <div className="flex gap-3 px-4 py-3 mt-4">
      {/* Workers */}
      <div className="flex-1 flex items-center gap-3 rounded-xl border border-primary px-4 py-3 bg-[var(--primary-side)]">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Users size={20} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-secondary">Total Workers</p>
          <p className="text-lg font-bold text-secondary">{totalWorkers}</p>
        </div>
      </div>

      {/* Amount */}
      <div className="flex-1 flex items-center gap-3 rounded-xl border border-primary px-4 py-3 bg-[var(--primary-side)]">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <IndianRupee size={20} className="text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-secondary">Total Amount</p>
          <p className="text-lg font-bold text-secondary">{formatINR(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
}