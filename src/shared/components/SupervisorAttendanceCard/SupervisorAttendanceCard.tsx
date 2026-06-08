import { Calendar, MapPin, HardHat } from 'lucide-react';

type Props = {
  supervisorName: string;
  supervisorRole: string;
  date: string;
  address: string;
  onPress?: () => void;
};

const SupervisorAttendanceCard: React.FC<Props> = ({
  supervisorName,
  supervisorRole,
  date,
  address,
  onPress,
}) => {
  return (
    <div
      onClick={onPress}
      className="bg-white dark:bg-[var(--card)] rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-shadow"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* ── Header Row ── */}
      <div className="flex items-center gap-3 mb-3">

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <HardHat className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
        </div>

        {/* Name + Role */}
        <div className="flex flex-col min-w-0">
          <span
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--foreground)' }}
          >
            {supervisorName}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full self-start mt-1"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--secondary)',
            }}
          >
            {supervisorRole}
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t mb-3" style={{ borderColor: 'var(--border)' }} />

      {/* ── Detail Rows ── */}
      <div className="flex flex-col gap-2">

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gray-color)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            {date}
          </span>
        </div>

        {/* Address */}
        {!!address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--gray-color)' }} />
            <span
              className="text-sm leading-snug line-clamp-2"
              style={{ color: 'var(--gray-color)' }}
            >
              {address}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default SupervisorAttendanceCard;