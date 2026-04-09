const basePath = "clients";

const ClientsUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
};

export { ClientsUrls };
