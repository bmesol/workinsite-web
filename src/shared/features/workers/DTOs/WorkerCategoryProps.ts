interface WorkerCategoryCreationRequest {
  workerCategoryName: string;
  note: string;
}

interface WorkerCategoryUpdationRequest extends WorkerCategoryCreationRequest {
  isActive: boolean;
}

interface WorkerCategoryProps extends WorkerCategoryUpdationRequest {
  id: number;
}

export type { WorkerCategoryCreationRequest, WorkerCategoryUpdationRequest, WorkerCategoryProps };
