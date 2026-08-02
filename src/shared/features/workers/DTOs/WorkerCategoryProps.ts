import type { WorkType, WorkTypeNew } from "./WorkTypeProps";
import type { WorkerRole, WorkerRoles } from "./WorkRoleProps";

interface WorkerCategoryCreationRequest {
  name: string;
  workTypes: { name: string }[];
  workerRoles: {
    name: string;
    salaryPerShift: string;
    hoursPerShift: string;
  }[];
  note: string;
}

// ✅ Matches what the backend actually reads on update — new/updated/deleted
// work types and worker roles are separate keys, not a single merged array.
// (Mirrors the mobile app's update payload shape.)
interface WorkerCategoryEditRequest {
  name: string;
  note: string;

  newWorkTypes: { name: string; unitId: number }[];
  updatedWorkTypes: { id: number; name: string; unitId?: number }[];
  deletedWorkTypes: number[];

  newWorkerRoles: WorkerRole[];
  updatedWorkerRoles: WorkerRoles[];
  deletedWorkerRoles: number[];
}

interface WorkerCategoryProps {
  id: number;
  name: string;
  workerCategoryName?: string;
  note?: string;
  isActive: boolean;
  workTypes: WorkType[];
  workerRoles: WorkerRoles[];
}

export type {
  WorkerCategoryCreationRequest,
  WorkerCategoryEditRequest,
  WorkerCategoryProps,
};