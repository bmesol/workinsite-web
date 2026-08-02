// import type { Site } from '@/shared/features/sites/DTOs/SiteProps';

// const priorityTaskType = {
//   Urgent: 1,
//   Ordinary: 2,
// };

// const statusTaskType = {
//   Open: 1,
//   Completed: 2,
//   Closed: 3,
// };

// interface Role {
//   id: number;
//   name: string;
// }

// interface Person {
//   id: number;
//   name: string;
//   phone: string;
//   language: string;
//   role: Role;
//   note: string;
//   isActive: boolean;
// }

// interface Task {
//   id: number;
//   taskName: string;
//   date: string;
//   site: Site;
//   priority: string;
//   status: string;
//   assignedTo: Person;
//   assignedBy: Person;
//   createdOn: string;
//   updatedOn: string;
//   remarks?: {
//     id: number;
//     remark: string;
//     createdBy: number;
//     createdByName: string;
//     roleName: string;
//   }[];
//   images?: any;
// }

// interface TaskCreation {
//   taskName: string;
//   date: string;
//   siteId: number;
//   supervisorId: number;
//   priority: number;
//   status: number;
//   remarks?: {
//     id: number;
//     remark: string;
//     createdBy: number;
//     createdByName: string;
//     roleName: string;
//   }[];
//   images?: any;
// }

// interface TaskUpdation {
//   taskName: string;
//   date: string;
//   siteId: number;
//   supervisorId: number;
//   priority: string;
//   status: string;
//   remarks?: {
//     id: number;
//     remark: string;
//     createdBy: number;
//     createdByName: string;
//     roleName: string;
//   }[];
//   images?: any;
// }

// export { priorityTaskType, statusTaskType };
// export type { Task, TaskCreation, TaskUpdation, Person };


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

interface Role {
  id: number;
  name: string;
}

interface Supervisor {
  id: number;
  name: string;
  phone: string;
  language: string;
  role: Role;
  note: string;
  isActive: boolean;
}

interface Remark {
  id: number;
  remark: string;
  createdBy: number;
  createdByName: string;
  roleName: string;
}

interface TaskImage {
  id: number;
  staticBaseUrl: string;
  imagePath: string;
  uploadedById: number;
  uploadedByName: string;
  roleName: string;
}

interface Task {
  id: number;
  taskName: string;
  date: string;
  site: Site;
  priority: string;
  status: string;
  assignedTo: Supervisor;
  assignedBy: Supervisor;
  createdOn: string;
  updatedOn: string;
  remarks?: Remark[];
  images?: TaskImage[];
}

interface TaskCreation {
  taskName: string;
  date: string;
  siteId: number;
  assignedTo: number;
  assignedBy: number;
  priority: number;
  status: number;
  remarks?: Remark[];
  images?: TaskImage[];
}

interface TaskUpdation {
  taskName: string;
  date: string;
  siteId: number;
  assignedTo: number;
  assignedBy: number;
  priority: string;
  status: string;
  remarks?: Remark[];
  images?: TaskImage[];
}

export { priorityTaskType, statusTaskType };
export type {
  Task,
  TaskCreation,
  TaskUpdation,
  Supervisor,
  Role,
  Remark,
  TaskImage,
};