import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useTaskService } from '@/shared/features/task/service/TaskService';
import { AuthHelper } from '@/shared/features/auth/helpers/AuthHelper';
import type { Task } from '@/shared/features/task/DTOs/TaskProps';
import type { TaskNotification } from '../DTOs/NotificationProps';

const POLL_INTERVAL = 30_000;

const userId = () => AuthHelper.getUserProfile()?.id ?? 'guest';
const getSeenKey = () => `seenTaskIds_${userId()}`;
const getUnreadKey = () => `unreadNotifications_${userId()}`;
const getUpdatedOnKey = () => `taskUpdatedOn_${userId()}`;

const getSeenIds = (): Set<number> => {
  try {
    const raw = localStorage.getItem(getSeenKey());
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
};

const saveSeenIds = (ids: Set<number>) => {
  localStorage.setItem(getSeenKey(), JSON.stringify([...ids]));
};

const loadUnread = (): TaskNotification[] => {
  try {
    const raw = localStorage.getItem(getUnreadKey());
    return raw ? (JSON.parse(raw) as TaskNotification[]) : [];
  } catch {
    return [];
  }
};

const saveUnread = (notifs: TaskNotification[]) => {
  localStorage.setItem(getUnreadKey(), JSON.stringify(notifs));
};

const loadUpdatedOnMap = (): Record<number, string> => {
  try {
    const raw = localStorage.getItem(getUpdatedOnKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUpdatedOnMap = (map: Record<number, string>) => {
  localStorage.setItem(getUpdatedOnKey(), JSON.stringify(map));
};

// Call this after the current user successfully submits a task update.
// It seeds their own updatedOn tracker so the next poll doesn't fire a
// self-notification for the change they just made.
const seedSelfUpdate = (taskId: number, updatedOn: string) => {
  const key = getUpdatedOnKey();
  try {
    const raw = localStorage.getItem(key);
    const map: Record<number, string> = raw ? JSON.parse(raw) : {};
    map[taskId] = updatedOn;
    localStorage.setItem(key, JSON.stringify(map));
  } catch {}
};

const getAssignedToName = (t: Task): string => {
  const assignee = t.assignedTo;
  const isCurrentUser =
    assignee?.id != null && String(assignee.id) === String(userId());
  return isCurrentUser ? 'You' : assignee?.name ?? 'Unassigned';
};

const buildNotification = (t: Task, type: 'new' | 'updated'): TaskNotification => ({
  taskId: t.id,
  taskName: t.taskName,
  assignedToName: getAssignedToName(t),
  siteName: t.site?.name ?? '',
  priority: t.priority,
  status: t.status,
  taskDate: t.date,
  dueDate: t.date,
  createdOn: t.createdOn,
  type,
});

const useTaskNotifications = () => {
  const taskService = useTaskService();
  const taskServiceRef = useRef(taskService);
  taskServiceRef.current = taskService;

  const [notifications, setNotifications] = useState<TaskNotification[]>(
    () => loadUnread(),
  );

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const tasks: Task[] = await taskServiceRef.current.getTasks();
        if (!Array.isArray(tasks)) return;

        const seenIds = getSeenIds();
        const updatedOnMap = loadUpdatedOnMap();
        const currentUserId = String(userId());

        // First visit: seed state and skip notifications so existing tasks
        // don't flood the bell on login.
        if (seenIds.size === 0) {
          tasks.forEach(t => {
            seenIds.add(t.id);
            if (t.updatedOn) updatedOnMap[t.id] = t.updatedOn;
          });
          saveSeenIds(seenIds);
          saveUpdatedOnMap(updatedOnMap);
          return;
        }

        const newNotifs: TaskNotification[] = [];

        // ── 1. New tasks → notify the assigned supervisor (assignedTo) ───
        // Only the person the task was assigned to should see the alert.
        const allNewTasks = tasks.filter(t => !seenIds.has(t.id));
        const newTasks = allNewTasks.filter(
          t => t.assignedTo?.id != null && String(t.assignedTo.id) === currentUserId,
        );

        if (newTasks.length > 0) {
          newNotifs.push(...newTasks.map(t => buildNotification(t, 'new')));

          const urgent = newTasks.filter(t => t.priority === 'Urgent');
          const ordinary = newTasks.filter(t => t.priority !== 'Urgent');

          urgent.forEach(t => {
            toast(`Urgent Task Assigned: ${t.taskName}`, {
              description: `Site: ${t.site?.name ?? ''} · Priority: ${t.priority}`,
            });
          });

          if (ordinary.length === 1) {
            toast(`New Task Assigned: ${ordinary[0].taskName}`, {
              description: `Site: ${ordinary[0].site?.name ?? ''}`,
            });
          } else if (ordinary.length > 1) {
            toast(`${ordinary.length} new tasks assigned to you`, {
              description: 'Open the notification bell for details',
            });
          }
        }

        // Mark ALL new tasks (not just the current user's) as seen so they
        // don't re-trigger on the next poll for anyone.
        allNewTasks.forEach(t => {
          seenIds.add(t.id);
          if (t.updatedOn) updatedOnMap[t.id] = t.updatedOn;
        });

        // ── 2. Updated tasks → notify the opposite party ─────────────────
        // The person who made the update already seeded their own updatedOnMap
        // via seedSelfUpdate(), so their poll sees no change and stays silent.
        // The other party's poll detects the changed updatedOn and is notified.
        const updatedTasks = tasks.filter(
          t =>
            seenIds.has(t.id) &&
            (
              (t.assignedBy?.id != null && String(t.assignedBy.id) === currentUserId) ||
              (t.assignedTo?.id != null && String(t.assignedTo.id) === currentUserId)
            ) &&
            t.updatedOn != null &&
            updatedOnMap[t.id] !== undefined &&
            t.updatedOn !== updatedOnMap[t.id],
        );

        if (updatedTasks.length > 0) {
          newNotifs.push(...updatedTasks.map(t => buildNotification(t, 'updated')));

          updatedTasks.forEach(t => {
            toast(`Task Updated: ${t.taskName}`, {
              description: `Status: ${t.status} · Assigned to: ${t.assignedTo?.name ?? ''}`,
            });
          });
        }

        // Refresh updatedOn for all tasks so next poll can detect further changes.
        tasks.forEach(t => {
          if (t.updatedOn) updatedOnMap[t.id] = t.updatedOn;
        });

        if (newNotifs.length > 0) {
          setNotifications(prev => {
            const next = [...newNotifs, ...prev];
            saveUnread(next);
            return next;
          });
        }

        saveSeenIds(seenIds);
        saveUpdatedOnMap(updatedOnMap);
      } catch {
        // Silent — poll errors must not disrupt the user
      }
    };

    const start = () => { timer = setInterval(poll, POLL_INTERVAL); };
    const stop = () => { if (timer) clearInterval(timer); };

    poll();
    start();

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        poll();
        start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const markRead = (taskId: number) =>
    setNotifications(prev => {
      const next = prev.filter(n => n.taskId !== taskId);
      saveUnread(next);
      return next;
    });

  const markAllRead = () => {
    saveUnread([]);
    setNotifications([]);
  };

  return { notifications, unreadCount: notifications.length, markRead, markAllRead };
};

export { useTaskNotifications, seedSelfUpdate };
