import { useMemo } from 'react';
import { Bell, User, Building2, Calendar } from 'lucide-react';
import type { TaskNotification } from '../../DTOs/NotificationProps';

const priorityStyleMap: Record<string, { dot: string; bg: string; color: string }> = {
  Urgent:   { dot: 'var(--danger-color)',  bg: 'rgba(220, 56, 72, 0.1)',  color: 'var(--danger-color)' },
  Ordinary: { dot: 'var(--success-color)', bg: 'rgba(25, 134, 83, 0.1)',  color: 'var(--success-color)' },
};

const getPriorityStyle = (priority: string) =>
  priorityStyleMap[priority] ?? { dot: 'var(--gray-color)', bg: '#f5f5f5', color: 'var(--gray-color)' };

// Backend stores UTC timestamps without 'Z'; append it so JS parses as UTC, not local time
const parseUTC = (iso: string) => new Date(iso.endsWith('Z') ? iso : `${iso}Z`);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatClock = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const formatRelativeTime = (createdOn: string): string => {
  const created = parseUTC(createdOn);
  if (isNaN(created.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (isSameDay(created, now)) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(created, yesterday)) return `Yesterday, ${formatClock(created)}`;

  return `${created.toLocaleDateString()}, ${formatClock(created)}`;
};

const groupByDay = (notifications: TaskNotification[]) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const groups: { label: string; items: TaskNotification[] }[] = [];
  const indexByLabel = new Map<string, number>();

  notifications.forEach(n => {
    const created = parseUTC(n.createdOn);
    let label: string;

    if (!isNaN(created.getTime()) && isSameDay(created, now)) {
      label = 'Today';
    } else if (!isNaN(created.getTime()) && isSameDay(created, yesterday)) {
      label = 'Yesterday';
    } else if (!isNaN(created.getTime())) {
      label = created.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    } else {
      label = 'Earlier';
    }

    if (!indexByLabel.has(label)) {
      indexByLabel.set(label, groups.length);
      groups.push({ label, items: [] });
    }
    groups[indexByLabel.get(label)!].items.push(n);
  });

  return groups;
};

type Props = {
  notifications: TaskNotification[];
  onRowClick: (n: TaskNotification) => void;
};

const NotificationList = ({ notifications, onRowClick }: Props) => {
  const grouped = useMemo(() => groupByDay(notifications), [notifications]);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <Bell size={40} className="mb-3" style={{ color: 'var(--gray-color)', opacity: 0.3 }} />
        <p className="text-sm" style={{ color: 'var(--gray-color)' }}>No new notifications</p>
      </div>
    );
  }

  return (
    <>
      {grouped.map(group => (
        <div key={group.label} className="mb-3 last:mb-0">
          <p className="text-xs font-semibold mb-1 px-1" style={{ color: 'var(--gray-color)' }}>
            {group.label}
          </p>
          <div className="space-y-2">
            {group.items.map(n => {
              const ps = getPriorityStyle(n.priority);
              return (
                <button
                  key={n.taskId}
                  onClick={() => onRowClick(n)}
                  className="relative w-full text-left overflow-hidden transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div className="flex items-start gap-2.5 px-3 py-2.5">
                    <span
                      className="mt-1.5 w-2 h-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: ps.dot }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {n.type === 'updated' && (
                            <span className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded mb-0.5 mr-1"
                              style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                              UPDATED
                            </span>
                          )}
                          <p className="text-sm font-medium leading-tight" style={{ color: 'var(--foreground)' }}>
                            {n.taskName}
                          </p>
                        </div>
                        <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--gray-color)' }}>
                          {formatRelativeTime(n.createdOn)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--gray-color)' }}>
                          <User size={13} className="flex-shrink-0" />
                          <span>{n.assignedToName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {n.status && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(100,116,139,0.1)', color: 'var(--gray-color)' }}>
                              {n.status}
                            </span>
                          )}
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: ps.bg, color: ps.color }}
                          >
                            {n.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {n.siteName && (
                          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--gray-color)' }}>
                            <Building2 size={13} className="flex-shrink-0" />
                            <span>{n.siteName}</span>
                          </div>
                        )}
                        {n.dueDate && (
                          <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--gray-color)' }}>
                            <Calendar size={13} className="flex-shrink-0" />
                            <span>Due: {n.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export { NotificationList };
