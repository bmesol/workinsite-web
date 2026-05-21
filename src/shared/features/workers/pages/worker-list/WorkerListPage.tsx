import { WorkerGetStartedPage } from "../worker-get-started/WorkerGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header, Actions } from "@/shared/components/Header/Header";
import { ContactTypes } from "@/shared/features/contacts/DTOs/ContactProps";
import { useWorkerList } from "./useWorkList";
import { useNavigate } from "react-router-dom";
import { WorkersUrls } from "../../utils/urls";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const WorkerListPage = () => {
  const navigate = useNavigate();
  const { workerDetails, fetchWorker, handleWorkerSelect, handleWorkerDelete, hasSearchFilter } = useWorkerList();
  const [searchValue, setSearchValue] = useState("");

  if (!workerDetails.length && !hasSearchFilter) return <WorkerGetStartedPage />;

  const handleSearch = () => {
    if (/^[a-zA-Z\s]*$/.test(searchValue)) {
      fetchWorker(searchValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container min-h-screen px-4 md:px-0">
      {/* Header */}
      <Header title="Workers">
        <Actions>
          <Button onClick={() => navigate(WorkersUrls.create)}>
            New Worker
          </Button>
        </Actions>
      </Header>

      {/* Search Box */}
      <div className="flex justify-end mt-4">
        <div className="relative w-full md:w-5/12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search workers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Worker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {!workerDetails.length ? (
          <div className="col-span-full my-4 text-center text-muted-foreground">
            No workers found
          </div>
        ) : (
          workerDetails.map((worker) => (
            <div
              key={worker.id}
              className="cursor-pointer"
              onClick={() => handleWorkerSelect(worker.id)}
            >
              <ContactCard
                name={worker.name}
                phone={worker.contact.contactDetails.find(
                  (item) => item.contactType === ContactTypes.PHONE
                )?.value}
                email={worker.contact.contactDetails.find(
                  (item) => item.contactType === ContactTypes.EMAIL
                )?.value}
                onDelete={(e: React.MouseEvent) => handleWorkerDelete(e, worker.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { WorkerListPage };