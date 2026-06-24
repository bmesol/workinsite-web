const AttendanceUrls = {
  list: `/attendance`,
  create: `/attendance/create`,
  edit: (id: number) => `/attendance/${id}/edit`,
};

const TaskUrls = {
  list: `/task`,           // ✅ was "/tasks" — route is "/task"
  create: `/task/create`,  // ✅ was "/tasks/create"
  edit: (id: number) => `/task/${id}/edit`,
};

const SiteUrls = {
  list: `/sites`,
  create: `/sites/create`,
  edit: (id: number) => `/sites/${id}/edit`,
};

const PurchaseUrls = {
  list: `/materials/purchase`,           // ✅ was "/purchases" — route is "/materials/purchase"
  create: `/materials/purchase/create`,  // ✅ was "/purchases/create"
  edit: (id: number) => `/materials/purchase/${id}/edit`,
};

export { AttendanceUrls, TaskUrls, SiteUrls, PurchaseUrls };