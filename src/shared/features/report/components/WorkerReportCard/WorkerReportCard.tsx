import { Badge } from "@/shared/components/ui/badge";
import { HardHat, ChevronRight } from "lucide-react";
import { formatINR } from "../../utils/DateUtils";

interface Props {
  workerName: string;
  workerCategoryName: string;
  amount?: string | number;
  onPress: () => void;
}

export function WorkerReportCard({
  workerName,
  workerCategoryName,
  amount,
  onPress,
}: Props) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border hover:border-[var(--primary)] hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--primary-side)] border border-[var(--primary)] flex items-center justify-center shrink-0">
          <HardHat size={18} className="text-[var(--secondary)]" />
        </div>

        <div>
          <p className="font-semibold text-[var(--secondary)] text-base">
            {workerName}
          </p>

          <Badge
            className="text-xs mt-0.5 bg-[var(--primary-side)] text-[var(--secondary)] border border-[var(--primary)] rounded-sm"
          >
            {workerCategoryName}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {amount && (
          <Badge className="rounded-md bg-[var(--success-color)]/10 text-[var(--success-color)] border border-[var(--success-color)]/30 font-bold text-base">
            {formatINR(amount)}
          </Badge>
        )}

        <ChevronRight
          size={16}
          className="text-[var(--gray-color)]"
        />
      </div>
    </button>
  );
}