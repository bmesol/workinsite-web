const AttendanceUrls = {
  list: `/attendance`,
  create: `/attendance/create`,
  edit: (id: number) => `/attendance/${id}/edit`,
};

const TaskUrls = {
  list: `/task`,
  create: `/task/create`,
  edit: (id: number) => `/task/${id}/edit`,
};

const SiteUrls = {
  list: `/sites`,
  create: `/sites/create`,
  edit: (id: number) => `/sites/${id}/edit`,
};

const PurchaseUrls = {
  list: `/materials/purchase`,
  create: `/materials/purchase/create`,
  edit: (id: number) => `/materials/purchase/${id}/edit`,
};

export { AttendanceUrls, TaskUrls, SiteUrls, PurchaseUrls };