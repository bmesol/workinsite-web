interface TaskNotification {
  taskId: number;
  taskName: string;
  assignedToName: string;
  siteName: string;
  priority: string;
  status: string;
  taskDate: string;
  dueDate: string;
  createdOn: string;
  type: 'new' | 'updated';
}

export type { TaskNotification };
