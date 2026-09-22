import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { SITE_STATUS } from '@/shared/constants/appEnums';

const SITE_STATUSES = [
  'All',
  SITE_STATUS.WORKING,
  SITE_STATUS.COMPLETED,
  SITE_STATUS.YET_TO_START,
  SITE_STATUS.HOLD,
];

const STATUS_DOT_COLORS: Record<string, string> = {
  [SITE_STATUS.WORKING]: '#1D9E75',
  [SITE_STATUS.COMPLETED]: '#185FA5',
  [SITE_STATUS.HOLD]: '#A32D2D',
  [SITE_STATUS.YET_TO_START]: '#BA7517',
};

type StatusFilterChipsProps = {
  value: string;
  onChange: (status: string) => void;
};

const StatusFilterChips = ({ value, onChange }: StatusFilterChipsProps) => {
  const { t } = useLanguage(); 

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
      {SITE_STATUSES.map((status) => {
        const isActive = value === status;
        const dotColor = status === 'All' ? 'var(--primary)' : STATUS_DOT_COLORS[status] ?? '#888';
        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className="shrink-0 border rounded-full px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            style={
              isActive
                ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' }
                : { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#374151' }
            }
          >
            {status !== 'All' && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: isActive ? '#fff' : dotColor }}
              />
            )}
            {t(status)}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilterChips;