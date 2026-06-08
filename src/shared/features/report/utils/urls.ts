const workerReportBasePath = "reports/worker";
const supervisorAttendanceBasePath = "reports/supervisor-attendance";
const availableMaterialReportBasePath = "reports/available-material";

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

export { WorkerReportUrls, AvailableMaterialReportUrls, SupervisorAttendanceUrls };