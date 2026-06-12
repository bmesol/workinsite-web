import { Trash2, Wrench, Calendar } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';
import { getStatusFromDates } from '@/shared/utils/function';

const STATUS_CONFIG: Record <
  'On Going' | 'Completed',
  { label: string; color: string }
> = {
  'On Going': { label: 'Ongoing', color: '#F97316' },
  Completed:  { label: 'Completed', color: '#22C55E' },
};

interface CuringCardProps {
  siteName: string;
  curingType: string;
  startDate: string;
  endDate: string;
  onPress: () => void;
  onDelete: () => void;
  permissionKey?: string;
}

const CuringCard = ({
  siteName,
  curingType,
  startDate,
  endDate,
  onPress,
  onDelete,
  permissionKey,
}: CuringCardProps) => {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const derivedStatus = getStatusFromDates(endDate);
  const statusConfig = STATUS_CONFIG[derivedStatus];

  return (
    <div
      onClick={onPress}
      className="flex items-stretch gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-shadow"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* ── Avatar ── */}
      <div
        className="h-16 w-16 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
        style={{
          background: 'var(--primary)',
          color: 'var(--secondary)',
        }}
      >
        {siteName?.charAt(0)?.toUpperCase()}
      </div>

      {/* ── Details ── */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">

        <span className="font-semibold text-base text-black truncate">
          {siteName}
        </span>

        {curingType && (
          <div className="flex items-center gap-1">
            <Wrench className="h-3 w-3 text-black shrink-0" />
            <span className="text-sm text-black truncate">{curingType}</span>
          </div>
        )}

        {(startDate || endDate) && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-black shrink-0" />
            <span className="text-sm text-black truncate">{startDate} – {endDate}</span>
          </div>
        )}
      </div>

      {/* ── Right col: status + delete ── */}
      <div className="flex flex-col items-end justify-between shrink-0 py-0.5 gap-2">

        {/* Status — dot + label */}
        <div className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: statusConfig.color }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Delete */}
        <div
          onClick={e => {
            e.stopPropagation();
            if (hasPermission) onDelete();
          }}
          className={`p-2 rounded-md hover:bg-destructive/10 transition-colors ${!hasPermission ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Trash2 className="h-5 w-5" style={{ color: 'var(--danger-color)' }} />
        </div>

      </div>
    </div>
  );
};

export default CuringCard;