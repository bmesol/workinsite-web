const materialsBasePath = "materials";
const unitBasePath = "materials/unit";

const MaterialsUrls = {
  list: `/${materialsBasePath}`,
  create: `/${materialsBasePath}/create`,
  edit: (id: number) => `/${materialsBasePath}/${id}/edit`,
};

const UnitUrls = {
  list: `/${unitBasePath}`,
  create: `/${unitBasePath}/create`,
};

export { MaterialsUrls, UnitUrls };