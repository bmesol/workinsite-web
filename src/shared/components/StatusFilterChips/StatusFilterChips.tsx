const SITE_STATUSES = ['All', 'Working', 'Completed', 'Yet to start', 'Hold'];

const STATUS_DOT_COLORS: Record<string, string> = {
  Working: '#1D9E75',
  Completed: '#185FA5',
  Hold: '#A32D2D',
  'Yet to start': '#BA7517',
};

type StatusFilterChipsProps = {
  value: string;
  onChange: (status: string) => void;
};

const StatusFilterChips = ({ value, onChange }: StatusFilterChipsProps) => (
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
          {status}
        </button>
      );
    })}
  </div>
);

export default StatusFilterChips;