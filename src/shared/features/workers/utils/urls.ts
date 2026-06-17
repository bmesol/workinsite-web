const workersBasePath = "workers";
const workerCategoriesBasePath = "worker-categories";
const workRateAbstractBasePath = "work-rate-abstracts";
const workModeBasePath = "work-modes";
const shiftBasePath = "workers/shift";

const WorkersUrls = {
  list: `/${workersBasePath}`,
  create: `/${workersBasePath}/create`,
  edit: (id: number) => `/${workersBasePath}/${id}/edit`,
};

const WorkerCategoriesUrls = {
  list: `/${workerCategoriesBasePath}`,
  create: `/${workerCategoriesBasePath}/create`,
  edit: (id: number) => `/${workerCategoriesBasePath}/${id}/edit`,
};

const WorkRateAbstractUrls = {
  list: `/${workRateAbstractBasePath}`,
  create: `/${workRateAbstractBasePath}/create`,
  edit: (id: number) => `/${workRateAbstractBasePath}/${id}/edit`,
};

const WorkModeUrls = {
  list: `/${workModeBasePath}`,
  create: `/${workModeBasePath}/create`,
  edit: (id: number) => `/${workModeBasePath}/${id}/edit`,
};

const ShiftUrls = {
  list: `/${shiftBasePath}`, 
};

export { WorkersUrls, WorkerCategoriesUrls, WorkRateAbstractUrls, WorkModeUrls, ShiftUrls };