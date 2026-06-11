import type { Site } from '@/shared/features/sites/DTOs/SiteProps';

const priorityTaskType = {
  Urgent: 1,
  Ordinary: 2,
};

const statusTaskType = {
  Open: 1,
  Completed: 2,
  Closed: 3,
};

interface Task {
  id: number;
  taskName: string;
  date: string;
  site: Site;
  priority: string;
  status: string;
  supervisor: Site;
  remarks?: {
    id: number;
    remark: string;
    createdBy: number;
    createdByName: string;
    roleName: string;
  }[];
  images?: any;
}

interface TaskCreation {
  taskName: string;
  date: string;
  siteId: number;
  supervisorId: number;
  priority: number;
  status: number;
  remarks?: {
    id: number;
    remark: string;
    createdBy: number;
    createdByName: string;
    roleName: string;
  }[];
  images?: any;
}

interface TaskUpdation {
  taskName: string;
  date: string;
  siteId: number;
  supervisorId: number;
  priority: string;
  status: string;
  remarks?: {
    id: number;
    remark: string;
    createdBy: number;
    createdByName: string;
    roleName: string;
  }[];
  images?: any;
}

export { priorityTaskType, statusTaskType };
export type { Task, TaskCreation, TaskUpdation };