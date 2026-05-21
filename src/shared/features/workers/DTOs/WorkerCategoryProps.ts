interface WorkerCategoryCreationRequest {
  workerCategoryName: string;
  note: string;
}

interface WorkerCategoryUpdationRequest extends WorkerCategoryCreationRequest {
  isActive: boolean;
}

interface WorkerCategoryProps extends WorkerCategoryUpdationRequest {
  id: number;
  name: string; 
  workTypes?: any[];      // ← add this
  workerRoles?: any[];    // ← add this
}

export type { WorkerCategoryCreationRequest, WorkerCategoryUpdationRequest, WorkerCategoryProps };