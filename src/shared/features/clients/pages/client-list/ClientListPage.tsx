import { ClientGetStartedPage } from "../client-get-started/ClientGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { ContactTypes } from "../../../contacts/DTOs/ContactProps";
import { useClientList } from "./useClientList";
import { ClientsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar"; 
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

const ClientListPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const {
    clientDetails,
    fetchClient,
    handleClientSelect,
    confirmDelete,
    handleClientDelete,
    hasSearchFilter,
    loading,
    deleteId,
    setDeleteId,
  } = useClientList();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!clientDetails.length && !hasSearchFilter)
    return <ClientGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title="Clients">
        <Actions>
          <Button onClick={() => navigate(ClientsUrls.create)}>
            Create Client
          </Button>
        </Actions>
      </Header>

      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchValue}
            setSearchText={(val) => {
              setSearchValue(val);
              fetchClient(val);
            }}
            searchCategory="Clients"
          />
        </div>
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
                  confirmDelete(e, client.id)
                }
              />
            </div>
          ))
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this client?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => deleteId && handleClientDelete(deleteId)}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ClientListPage };