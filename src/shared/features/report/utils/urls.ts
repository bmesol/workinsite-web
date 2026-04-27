const basePath = "reports/worker";

const WorkerReportUrls = {
  list: `/${basePath}`,
  details: (workerId: number) => `/${basePath}/${workerId}`,
};

export { WorkerReportUrls };