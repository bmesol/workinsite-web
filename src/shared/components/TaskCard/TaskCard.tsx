import { Card } from '@/shared/components/ui/card';
import { MapPin, User, Calendar, Trash2 } from 'lucide-react';
import { usePermission } from '@/shared/hooks/usePermission';

interface TaskCardProps {
  taskName: string;
  siteId: any;
  supervisor: string;
  date: string;
  priority: string;
  status: string;
  onPress: () => void;
  onDelete: () => void;
  permissionKey?: string;
}

const getChipStyle = (type: 'priority' | 'status', value?: number | string) => {
  const styleMap = {
    priority: {
      1: { bg: '#FDECEA', text: 'var(--danger-color)' },
      2: { bg: '#E8F5E9', text: 'var(--success-color)' },
      Urgent: { bg: '#FDECEA', text: 'var(--danger-color)' },
      Ordinary: { bg: '#E8F5E9', text: 'var(--success-color)' },
    },
    status: {
      1: { bg: '#f5ede4', text: 'var(--warning-color)' },
      2: { bg: '#FDECEA', text: 'var(--danger-color)' },
      3: { bg: '#E8F5E9', text: 'var(--success-color)' },
      Open: { bg: '#f5ede4', text: 'var(--warning-color)' },
      Completed: { bg: '#FDECEA', text: 'var(--danger-color)' },
      Closed: { bg: '#E8F5E9', text: 'var(--success-color)' },
    },
  };

  return styleMap[type][value as keyof (typeof styleMap)[typeof type]];
};

export const TaskCard = ({
  taskName,
  siteId,
  supervisor,
  date,
  priority,
  status,
  onPress,
  onDelete,
  permissionKey,
}: TaskCardProps) => {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  const priorityStyle = getChipStyle('priority', priority);
  const statusStyle = getChipStyle('status', status);

  return (
    <Card
      className="w-full p-4 gap-1.5 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onPress}
    >
      {/* ── Top Row: Name + Delete ── */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-base text-black truncate flex-1 pr-2">
          {taskName}
        </span>
        <div
          className="shrink-0  rounded-md hover:bg-destructive/10 transition-colors"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasPermission) onDelete();
          }}
          style={{
            opacity: hasPermission ? 1 : 0.5,
            cursor: hasPermission ? 'pointer' : 'not-allowed',
          }}
        >
          <Trash2 className="h-5 w-5" style={{ color: 'var(--danger-color)' }} />
        </div>
      </div>

      {/* ── Site | Supervisor ── */}
      <div className="flex items-center ">
        {siteId && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-black shrink-0" />
            <span className="text-sm text-black truncate">{siteId}</span>
          </div>
        )}

        {siteId && supervisor && (
          <span className="mx-1.5 text-muted-foreground">|</span>
        )}

        {supervisor && (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-black shrink-0" />
            <span className="text-sm text-black truncate">{supervisor}</span>
          </div>
        )}
      </div>

      {/* ── Date + Priority/Status chips ── */}
      <div className="flex items-center justify-between ">
        {date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-black shrink-0" />
            <span className="text-sm text-black truncate">{date}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {priority && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: priorityStyle.bg,
                color: priorityStyle.text,
              }}
            >
              {priority}
            </span>
          )}

          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {status}
          </span>
        </div>
      </div>
    </Card>
  );
};