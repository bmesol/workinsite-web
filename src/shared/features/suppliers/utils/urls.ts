const basePath = "suppliers";

const SuppliersUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
};

export { SuppliersUrls };
