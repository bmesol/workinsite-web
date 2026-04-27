import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { formatINR } from "../../utils/DateUtils";

interface Props {
  date: string;
  siteName: string;
  amount: number | string;
  isFirst?: boolean;
  onPress: () => void;
}

export function RecordCard({ date, siteName, amount, isFirst, onPress }: Props) {
  return (
    <button
      onClick={onPress}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border shadow-sm text-left transition-all ${
        isFirst
          ? "bg-[var(--primary-side)] border-[var(--primary)]/30"
          : "bg-card border-border"
      }`}
    >
      <div className="flex-1 min-w-0 mr-3">
        {/* Date */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-[var(--primary)]/20 flex items-center justify-center">
            <Calendar size={12} className="text-[var(--secondary)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--secondary)]">
            {date}
          </span>
        </div>

        {/* Site */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--secondary)]/10 flex items-center justify-center">
            <MapPin size={14} className="text-[var(--secondary)]" />
          </div>
          <span className="text-sm text-[var(--gray-color)] truncate">
            {siteName}
          </span>
        </div>
      </div>

      {/* Amount — keeping green as requested */}
      <div className="flex items-center gap-2">
        <span className="bg-[var(--payment-light-green)] text-[var(--payment-green)] font-bold rounded-xl px-4 py-1 text-sm border border-[var(--payment-green)]/30">
          {formatINR(amount)}
        </span>
        <ChevronRight size={16} className="text-[var(--gray-color)]" />
      </div>
    </button>
  );
}