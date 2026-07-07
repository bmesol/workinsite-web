export interface WorkerRoleCostEditRouteParams {
  workerCategoryId: number;
  redirect: string;
  id: number; // Worker ID
}

export interface WorkerRoleCost {
  workerId: number;
  workerRoleId: number;
  siteId?: number;
  salaryPerShift: string;
  hoursPerShift: string;
}

export interface GetWorkerRoleCostParams {
  WorkerCategoryId?: number;
  WorkerId?: number;
  showLoader?: boolean;
}