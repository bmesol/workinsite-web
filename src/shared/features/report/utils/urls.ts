const workerReportBasePath = "reports/worker";
const supervisorAttendanceBasePath = "reports/supervisor-attendance";
const availableMaterialReportBasePath = "reports/available-material";
const inventoryStockReportBasePath = "reports/inventory-stock";

const WorkerReportUrls = {
  list: `/${workerReportBasePath}`,
  details: (workerId: number) => `/${workerReportBasePath}/${workerId}`,
};

const AvailableMaterialReportUrls = {
  list: `/${availableMaterialReportBasePath}`,
};

const SupervisorAttendanceUrls = {
  list: `/${supervisorAttendanceBasePath}`,
};

const InventoryStockReportUrls = {
  list: `/${inventoryStockReportBasePath}`,
};

export { WorkerReportUrls, AvailableMaterialReportUrls, SupervisorAttendanceUrls, InventoryStockReportUrls };