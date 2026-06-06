const materialsBasePath = "materials";
const unitBasePath = "materials/unit";
const purchaseBasePath = "materials/purchase";
const materialUsedBasePath = "materials/used";
const materialShiftBasePath = "materials/shift";  // ✅ added

const MaterialsUrls = {
  list: `/${materialsBasePath}`,
  create: `/${materialsBasePath}/create`,
  edit: (id: number) => `/${materialsBasePath}/${id}/edit`,
};

const UnitUrls = {
  list: `/${unitBasePath}`,
  create: `/${unitBasePath}/create`,
};

const PurchaseUrls = {
  list: `/${purchaseBasePath}`,
  create: `/${purchaseBasePath}/create`,
  edit: (id: number) => `/${purchaseBasePath}/${id}/edit`,
};

const MaterialUsedUrls = {
  list: `/${materialUsedBasePath}`,
  create: `/${materialUsedBasePath}/create`,
  edit: (id: number) => `/${materialUsedBasePath}/${id}/edit`,
};

// ✅ added
const MaterialShiftUrls = {
  list: `/${materialShiftBasePath}`,
  create: `/${materialShiftBasePath}/create`,
  edit: (id: number) => `/${materialShiftBasePath}/${id}/edit`,
};

export { MaterialsUrls, UnitUrls, PurchaseUrls, MaterialUsedUrls, MaterialShiftUrls };