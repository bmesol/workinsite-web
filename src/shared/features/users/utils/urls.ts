const basePath = "users";

const UsersUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
};

export { UsersUrls };