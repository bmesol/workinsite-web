import type { Client, ClientRequest } from "./ClientProps";

interface ClientDetailsType {
  clientDetails: ClientRequest | Client;
  setClientDetails: React.Dispatch<React.SetStateAction<ClientRequest | Client>>;
}

export type { ClientDetailsType };