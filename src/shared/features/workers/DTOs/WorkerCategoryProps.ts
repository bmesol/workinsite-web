// 

interface WorkerCategoryCreationRequest {
  name: string;
  workTypes: { name: string }[];        // ✅ object array
  workerRoles: {
    name: string;
    salaryPerShift: string;
    hoursPerShift: string;
  }[];                                   // ✅ object array
  note: string;
}

interface WorkerCategoryUpdationRequest extends WorkerCategoryCreationRequest {
  isActive: boolean;
}

interface WorkerCategoryProps extends WorkerCategoryUpdationRequest {
  id: number;
}

export type { WorkerCategoryCreationRequest, WorkerCategoryUpdationRequest, WorkerCategoryProps };