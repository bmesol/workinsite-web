import { useNavigate } from "react-router-dom";
import { Header } from "@/shared/components/Header/Header";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { WorkRateAbstractUrls } from "../../utils/urls";
import { useWorkRateAbstractList } from "./useWorkRateAbstractList"; // ✅ fixed: Abstraction → Abstract
import type { WorkRateAbstractProps } from "../../DTOs/WorkRateAbstract";
import { Search } from "lucide-react";
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

const WorkRateAbstractListPage = () => {
  const navigate = useNavigate();

  const {
    workRateAbstract,
    handleEditworkRateAbstract,
    loading,
    confirmDelete,
    handleDelete,
    handleCancelDelete,
    deleteId,
    searchText,
    setSearchText,
  } = useWorkRateAbstractList(); // ✅ fixed: useWorkRateAbstractionList → useWorkRateAbstractList

  // ✅ Client-side filter by site name
  const filteredList = workRateAbstract?.filter((item: WorkRateAbstractProps) =>
    item.site?.name?.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-6 pb-10">
      <Header title="Work Rate Abstract List">
        <Button onClick={() => navigate(WorkRateAbstractUrls.create)}>
          Create Work Rate Abstract
        </Button>
      </Header>

      {/* ✅ Search bar — same style as WorkerCategoryListPage */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search work rate abstract..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredList.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            No Work Rate Abstract found
          </p>
        ) : (
          filteredList.map((item: WorkRateAbstractProps) => (
            <ContactCard
              key={item.id}
              name={item.site.name}
              workType={item.workType.name}
              onDelete={() => confirmDelete(item.id)}
              onPress={() => handleEditworkRateAbstract(item.id)}
              permissionKey="Work Rate Abstract"
            />
          ))
        )}
      </div>

      {/* ✅ Delete confirm dialog */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Detail?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { WorkRateAbstractListPage };