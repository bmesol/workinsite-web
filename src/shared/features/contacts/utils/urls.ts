const basePath = "contacts";

const ContactsUrls = {
  list: `/${basePath}`,
  create: `/${basePath}/create`,
  edit: (id: number) => `/${basePath}/${id}/edit`,
};

export { ContactsUrls };