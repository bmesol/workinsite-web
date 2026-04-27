const basePath = "sites";

const SitesUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
};

export { SitesUrls };
