const rolesBasePath = "roles-rights";

const RolesUrls = {
  list: `/${rolesBasePath}`,
  details: (id: number) => `/${rolesBasePath}/${id}`,
};

export {  RolesUrls };