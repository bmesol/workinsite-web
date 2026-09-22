export const SITE_STATUS = {
  YET_TO_START: 'Yet to start',
  WORKING: 'Working',
  HOLD: 'Hold',
  COMPLETED: 'Completed',
} as const;

export type SiteStatusValue = (typeof SITE_STATUS)[keyof typeof SITE_STATUS];

export const TASK_PRIORITY = {
  Urgent: 1,
  Ordinary: 2,
} as const;

export type TaskPriorityLabel = keyof typeof TASK_PRIORITY;

export const TASK_STATUS = {
  Open: 1,
  Completed: 2,
  Closed: 3,
} as const;

export type TaskStatusLabel = keyof typeof TASK_STATUS;

export const TASK_PRIORITY_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Ordinary', value: 'Ordinary' },
];

export const TASK_STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Open', value: 'Open' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Closed', value: 'Closed' },
];
