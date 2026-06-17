const clientTransactionBasePath = "transactions/client";
const supplierTransactionBasePath = "transactions/supplier";
const workerTransactionBasePath = "transactions/worker";

const ClientTransactionUrls = {
  list: `/${clientTransactionBasePath}`,
  create: `/${clientTransactionBasePath}/create`,
  edit: (id: number) => `/${clientTransactionBasePath}/${id}/edit`,
};

const SupplierTransactionUrls = {
  list: `/${supplierTransactionBasePath}`,
  create: `/${supplierTransactionBasePath}/create`,
  edit: (id: number) => `/${supplierTransactionBasePath}/${id}/edit`,
};

const WorkerTransactionUrls = {
  list: `/${workerTransactionBasePath}`,
  create: `/${workerTransactionBasePath}/create`,
  edit: (id: number) => `/${workerTransactionBasePath}/${id}/edit`,
};

export { ClientTransactionUrls, SupplierTransactionUrls, WorkerTransactionUrls };