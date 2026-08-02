import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import { TaskUrls } from '@/shared/features/task/utils/urls';
import { NotificationList } from '../pages/notification-list/NotificationList';
import type { TaskNotification } from '../DTOs/NotificationProps';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead } = useTaskNotifications();
  const [open, setOpen] = useState(false);

  const handleRowClick = (n: TaskNotification) => {
    markRead(n.taskId);
    setOpen(false);
    navigate(TaskUrls.list);
  };

  const handleViewAll = () => {
    markAllRead();
    setOpen(false);
    navigate(TaskUrls.list);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-[var(--select-hover-bg)] transition-colors"
        aria-label="Task notifications"
      >
        <Bell size={22} style={{ color: 'var(--gray-color)' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white rounded-full"
            style={{ backgroundColor: 'var(--danger-color)' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[380px] gap-0 p-0 flex flex-col [&>button]:hidden"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <SheetHeader
            className="flex-row items-center justify-between px-6 py-5 gap-0"
            style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
          >
            <SheetTitle className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
            </SheetTitle>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-[var(--select-hover-bg)] transition-colors"
            >
              <X size={20} style={{ color: 'var(--gray-color)' }} />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <NotificationList notifications={notifications} onRowClick={handleRowClick} />
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
              <Button variant="default" className="w-full cursor-pointer" onClick={handleViewAll}>
                View all tasks
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export { NotificationBell };
