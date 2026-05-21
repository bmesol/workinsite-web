import { useWorkerService } from "../../service/WorkerService";
import type { Worker } from "../../DTOs/WorkerProps";
import { useNavigate } from "react-router-dom";
import { WorkersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";

const useWorkerList = () => {
  const navigate = useNavigate();
  const workerService = useWorkerService();
  const [workerDetails, setWorkerDetails] = useState<Worker[]>([]);

  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

  const fetchWorker = async (searchString: string = "") => {
    const workerData = await workerService.getWorkers(searchString);
    if (!!searchString) setHasSearchFilter(true);
    setWorkerDetails(workerData);
  };

  useEffect(() => { fetchWorker() }, []);

  const handleWorkerSelect = (id: number) => navigate(WorkersUrls.edit(id));

  const handleWorkerDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await workerService.deleteWorker(id);
    window.location.reload();
  };

  return { workerDetails, fetchWorker, handleWorkerSelect, handleWorkerDelete, hasSearchFilter };
};

export { useWorkerList };
