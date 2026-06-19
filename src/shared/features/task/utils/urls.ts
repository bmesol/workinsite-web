const taskBasePath = "task";

const TaskUrls = {
  list: `/${taskBasePath}`,
  create: `/${taskBasePath}/create`,
  edit: (id: number) => `/${taskBasePath}/${id}/edit`,
};

export { TaskUrls };