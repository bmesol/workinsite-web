import { ClientGetStartedPage } from "../client-get-started/ClientGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ContactTypes } from "../../../contacts/DTOs/ContactProps";
import { useClientList } from "./useClientList";
import { ClientsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

const ClientListPage = () => {
  const navigate = useNavigate();
  const {
    clientDetails,
    fetchClient,
    handleClientSelect,
    handleClientDelete,
    hasSearchFilter,
  } = useClientList();

  if (!clientDetails.length && !hasSearchFilter)
    return <ClientGetStartedPage />;

  return (
    <div className="container min-h-screen px-4 py-6">
      <Header title="Clients">
        <Actions>
          <Button onClick={() => navigate(ClientsUrls.create)}>
            Create Client
          </Button>
        </Actions>
      </Header>

      {/* Search */}
      <div className="flex justify-end mt-4 mb-4">
        <Input
          className="w-full sm:w-72"
          placeholder="Search clients..."
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
              fetchClient(value);
            }
          }}
        />
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {!clientDetails.length ? (
          <div className="col-span-2 my-4 text-center text-sm text-muted-foreground">
            No clients found
          </div>
        ) : (
          clientDetails.map((client) => (
            <div
              key={client.id}
              onClick={() => handleClientSelect(client.id)}
              className="cursor-pointer w-full"
            >
              <ContactCard
                name={client.name}
                phone={client.contact?.phone}
                email={
                  client.contact?.contactDetails?.find(
                    (item) => item.contactType === ContactTypes.EMAIL,
                  )?.value
                }
                onDelete={(e: React.MouseEvent) =>
                  handleClientDelete(e, client.id)
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { ClientListPage };
