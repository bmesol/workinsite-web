import { useNavigate } from "react-router-dom";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search } from "lucide-react";
import { useWorkerCategoryList } from "./useWorkerCategoryList";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { WorkerCategoriesUrls } from "../../utils/urls";
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

const WorkerCategoryListPage = () => {
  const navigate = useNavigate();
  const {
    workerCategoryDetails,
    searchText,
    setSearchText,
    loading,
    deleteId,
    setDeleteId,
    confirmDelete,
    handleEditWorkerCategory,
    handleWorkerCategoryDelete,
  } = useWorkerCategoryList();

  const filteredWorkerCategoryList = workerCategoryDetails.filter((item) =>
    (item.name ?? "").toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {/* Header */}
      <Header title="Worker Category List">
        <Actions>
          <Button onClick={() => navigate(WorkerCategoriesUrls.create)}>
            Create Worker Category
          </Button>
        </Actions>
      </Header>

      {/* Search Bar */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search worker category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filteredWorkerCategoryList.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            No Worker Category found
          </p>
        ) : (
          filteredWorkerCategoryList.map((workerCategory) => (
            <ContactCard
              key={workerCategory.id}
              name={workerCategory.name}
              workType={`Work Type Count : ${workerCategory?.workTypes?.length ?? 0}`}
              workerRole={`Worker Role Count : ${workerCategory?.workerRoles?.length ?? 0}`}
              onDelete={(e: React.MouseEvent) =>
                confirmDelete(e, workerCategory.id)
              } // ← same as client pattern
              onPress={() => handleEditWorkerCategory(workerCategory.id)}
              permissionKey="Worker Category"
            />
          ))
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="test-sm">
              Are you sure you want to delete this worker category?
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
      onClick={() => deleteId && handleWorkerCategoryDelete(deleteId)}
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

export { WorkerCategoryListPage };
