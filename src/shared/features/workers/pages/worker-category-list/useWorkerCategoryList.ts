import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkerCategoryService } from "@/shared/features/workers/service/WorkerCategoryService";
import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";
import { WorkerCategoriesUrls } from "../../utils/urls";
import { toast } from "sonner";

const useWorkerCategoryList = () => {
  const navigate = useNavigate();
  const workerCategoryService = useWorkerCategoryService();

  const [workerCategoryDetails, setWorkerCategoryDetails] = useState<WorkerCategoryProps[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);


  const fetchWorkerCategory = async (searchString = "") => {
    const data = await workerCategoryService.getWorkerCategories(searchString);
    setWorkerCategoryDetails(data);
    if (data) setLoading(false);
  };

  useEffect(() => {
    fetchWorkerCategory();
  }, []);

  useEffect(() => {
    fetchWorkerCategory(searchText);
  }, [searchText]);

  const handleEditWorkerCategory = (id: number) => {
    navigate(WorkerCategoriesUrls.edit(id));
  };

  // same pattern as handleClientDelete
  const confirmDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleWorkerCategoryDelete = async (id: number) => {
    try {
      await workerCategoryService.deleteWorkerCategory(id);
      fetchWorkerCategory();
      toast.success("Worker category deleted successfully");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.[0]?.message || "Failed to delete worker category";
      toast.error(errorMsg);
    } finally {
      setDeleteId(null);
    }
  };

  return {
    workerCategoryDetails,
    fetchWorkerCategory,
    searchText,
    setSearchText,
    loading,
    deleteId,
    setDeleteId,
    confirmDelete,                  // ← export this
    handleEditWorkerCategory,
    handleWorkerCategoryDelete,
  };
};

export { useWorkerCategoryList };