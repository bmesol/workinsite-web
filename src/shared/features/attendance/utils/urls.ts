const basePath = "attendance";

const AttendanceUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
  view: (id: number) => `/${basePath}/${id}`,
};

export { AttendanceUrls };