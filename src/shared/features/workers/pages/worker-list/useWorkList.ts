import { useWorkerService } from "../../service/WorkerService";
import { useWorkerCategoryService } from "../../service/WorkerCategoryService";
import type { Worker } from "../../DTOs/WorkerProps";
import { useNavigate } from "react-router-dom";
import { WorkersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import type { WorkerCategoryProps } from "../../DTOs/WorkerCategoryProps";

const useWorkerList = () => {
  const navigate = useNavigate();
  const workerService = useWorkerService();
  const workerCategoryService = useWorkerCategoryService();
  const [workerDetails, setWorkerDetails] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [searchText, setSearchText] = useState("");
  const [appliedFilters, setAppliedFilters] = useState("");
  const [workerCategory, setWorkerCategory] = useState<{
    value: string;
    name: string;
  }>({ value: "", name: "" });

  const [workerCategoryList, setWorkerCategoryList] = useState<WorkerCategoryProps[]>([]);

  // ✅ Initial load only
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const workerData = await workerService.getWorkers({ WorkerName: "" });
        setWorkerDetails(workerData);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  // ✅ Search + filter fetch — no full page load
  const fetchWorker = async (overrideFilters?: {
    WorkerName?: string;
    WorkerCategoryId?: number;
  }) => {
    setSearchLoading(true);
    try {
      const filters = overrideFilters ?? {
        WorkerName: searchText.trim() || undefined,
        WorkerCategoryId: workerCategory?.value
          ? Number(workerCategory.value)
          : undefined,
      };
      const workerData = await workerService.getWorkers(filters);
      setWorkerDetails(workerData);
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ Dialog Search button press
  const handleSearch = () => {
    const filters = [searchText, workerCategory?.name]
      .filter(Boolean)
      .join(", ");
    setAppliedFilters(filters || "");
    fetchWorker();
  };

  // ✅ Clear all filters
  const handleClearSearch = () => {
    setSearchText("");
    setWorkerCategory({ value: "", name: "" });
    setAppliedFilters("");
    fetchWorker({ WorkerName: undefined, WorkerCategoryId: undefined });
  };

  // ✅ Worker category search in combobox
  const fetchWorkerCategories = async (searchString: string = "") => {
    if (!searchString) return;
    const categories = await workerCategoryService.getWorkerCategories(
      searchString,
      false
    );
    if (categories) setWorkerCategoryList(categories.slice(0, 3));
  };

  const workerCategoryDetails = workerCategoryList.map((cat) => ({
    label: cat.name,
    value: cat.id.toString(),
  }));

  const handleWorkerSelect = (id: number) => navigate(WorkersUrls.edit(id));

  const confirmDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const refreshList = async () => {
    const workerData = await workerService.getWorkers({ WorkerName: "" });
    setWorkerDetails(workerData);
  };

  const handleWorkerDelete = async (id: number) => {
    await workerService.deleteWorker(id);
    setDeleteId(null);
    refreshList();
  };

  const isFiltered = !!(searchText || workerCategory?.value);

  return {
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
  };
};

export { useWorkerList };