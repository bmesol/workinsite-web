const curingBasePath = "curing";
const curingTypeBasePath = "curing/types";

const CuringUrls = {
  list: `/${curingBasePath}`,
  create: `/${curingBasePath}/create`,
  edit: (id: number) => `/${curingBasePath}/${id}/edit`,
};

const CuringTypeUrls = {
  list: `/${curingTypeBasePath}`,
  create: `/${curingTypeBasePath}/create`,
  edit: (id: number) => `/${curingTypeBasePath}/${id}/edit`,
};

export { CuringUrls, CuringTypeUrls };