import { WorkerGetStartedPage } from "../worker-get-started/WorkerGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header, Actions } from "@/shared/components/Header/Header";
import { ContactTypes } from "@/shared/features/contacts/DTOs/ContactProps";
import { useWorkerList } from "./useWorkList";
import { useNavigate } from "react-router-dom";
import { WorkersUrls } from "../../utils/urls";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ComboboxField } from "@/shared/components/FormFields/ComboBoxField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
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

const WorkerListPage = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    workerDetails,
    fetchWorker,
    handleWorkerSelect,
    confirmDelete,
    handleWorkerDelete,
    loading,
    searchLoading,
    deleteId,
    setDeleteId,
    searchText,
    setSearchText,
    workerCategory,
    setWorkerCategory,
    workerCategoryDetails,
    fetchWorkerCategories,
    appliedFilters,
    handleSearch,
    handleClearSearch,
    isFiltered,
  } = useWorkerList();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!workerDetails.length && !appliedFilters)
    return <WorkerGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title="Workers">
        <Actions>
          <Button onClick={() => navigate(WorkersUrls.create)}>
            New Worker
          </Button>
        </Actions>
      </Header>

      <div className="flex justify-end items-center gap-2 mt-4">
        {appliedFilters ? (
          <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-foreground bg-background flex-1 md:flex-none md:w-auto">
            <span className="truncate">{appliedFilters}</span>
            <button
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // No filter — placeholder button
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm text-muted-foreground bg-background hover:border-ring transition-colors flex-1 md:flex-none md:min-w-48"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" />
            <span>Search Workers...</span>
          </button>
        )}

        {/* Filter icon button — always visible */}
        {appliedFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Loading */}
      {searchLoading && (
        <p className="text-xs text-muted-foreground mt-2 text-right">
          Searching...
        </p>
      )}

      {/* Worker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {!workerDetails.length ? (
          <div className="col-span-full my-4 text-center text-muted-foreground">
            No workers found
          </div>
        ) : (
          workerDetails.map((worker) => {
            const phone = worker.contact.contactDetails.find(
              (item) => item.contactType === ContactTypes.PHONE
            )?.value;
            const email = worker.contact.contactDetails.find(
              (item) => item.contactType === ContactTypes.EMAIL
            )?.value;
            return (
              <div
                key={worker.id}
                className="cursor-pointer"
                onClick={() => handleWorkerSelect(worker.id)}
              >
                <ContactCard
                  name={worker.name}
                  displayName={`${worker.name} [${worker.workerCategory?.name ?? ""}]`}
                  phone={phone}
                  email={phone ? undefined : email}
                  onDelete={(e: React.MouseEvent) =>
                    confirmDelete(e, worker.id)
                  }
                />
              </div>
            );
          })
        )}
      </div>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Worker Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            {/* Worker Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium">Search Workers</label>
              <Input
                placeholder="Enter worker name"
                value={searchText}
                onChange={(e) => {
                  const sanitized = e.target.value
                    .replace(/[^a-zA-Z\s]/g, "")
                    .trimStart();
                  setSearchText(sanitized);
                }}
              />
            </div>

            {/* Worker Category */}
            <ComboboxField
              id="workerCategory"
              label="Worker Category"
              items={workerCategoryDetails}
              selectedValue={workerCategory?.value}
              onValueChange={(val) => {
                const selected = workerCategoryDetails.find(
                  (c) => c.value === val
                );
                setWorkerCategory({
                  value: val,
                  name: selected?.label ?? "",
                });
              }}
              onSearch={fetchWorkerCategories}
            />

            {/* Search Button */}
            <Button
              onClick={() => {
                handleSearch();
                setFilterOpen(false);
              }}
              disabled={!isFiltered}
              className="w-full"
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
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
              Are you sure you want to delete this worker?
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
                onClick={() => deleteId && handleWorkerDelete(deleteId)}
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

export { WorkerListPage };