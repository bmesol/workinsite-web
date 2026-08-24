import { useEffect, useState } from 'react';
import type { AttendanceProps } from '../../DTOs/AttendanceProps';
import { useAttendanceService } from '@/shared/features/attendance/service/AttendanceService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWageTypeService } from '@/shared/features/sites/service/WageTypeService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWorkTypeService } from '@/shared/features/workers/service/WorkerTypeService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { WageType, Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import type { WorkTypeProp } from '@/shared/features/workers/DTOs/WorkTypeProps';
import { useNavigate } from 'react-router-dom';
import { AttendanceUrls } from '../../utils/urls';
import { toast } from 'sonner';

interface WorkType {
  value: string;
  name: string;
  workerCategoryId: string;
}

const defaultFilter = {
  value: '',
  name: '',
};

const defaultWorkType = {
  value: '',
  name: '',
  workerCategoryId: '',
};

export const useAttendanceList = () => {
  const navigate = useNavigate();

  const attendanceService = useAttendanceService();
  const siteService = useSiteService();
  const wageTypeService = useWageTypeService();
  const workTypeService = useWorkTypeService();
  const workerService = useWorkerService();

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');

  // Filter dialog state — replaces bottomSheetRef
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Delete confirm dialog state — replaces Alert.alert
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Work type change dialog state — replaces Alert.alert
  const [isWorkTypeChangeDialogOpen, setIsWorkTypeChangeDialogOpen] = useState(false);
  const [pendingWorkType, setPendingWorkType] = useState<WorkType | null>(null);

  const [attendance, setAttendance] = useState<AttendanceProps[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkTypeProp[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);

  const [date, setDate] = useState('');
  const [siteId, setSiteId] = useState(defaultFilter);
  const [wageTypeId, setWageTypeId] = useState(defaultFilter);
  const [workTypeId, setWorkTypeId] = useState(defaultWorkType);
  const [workerId, setWorkerId] = useState(defaultFilter);

  // Fetch on mount
  useEffect(() => {
    fetchAttendance(true);
  }, []);

  const fetchAttendance = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      siteId: siteId.value ? parseInt(siteId.value) : undefined,
      wageTypeId: wageTypeId.value ? parseInt(wageTypeId.value) : undefined,
      workTypeId: workTypeId.value ? parseInt(workTypeId.value) : undefined,
      workerId: workerId.value ? parseInt(workerId.value) : undefined,
      date: date || undefined,
    };

    if (!reset && !hasMore) return;

    reset ? setLoading(true) : setPaginationLoading(true);

    try {
      const response = await attendanceService.getAttendances({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (reset) {
        setAttendance(items);
        setPageNumber(2);
      } else {
        setAttendance(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }
      setHasMore(response.totalPages > response.pageNumber);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = [
      date,
      siteId?.name,
      wageTypeId?.name,
      workTypeId?.name,
      workerId?.name,
    ]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    setIsFilterOpen(false);     
    fetchAttendance(true);
  };

  const resetForm = () => {
    setDate('');
    setSiteId(defaultFilter);
    setWageTypeId(defaultFilter);
    setWorkTypeId(defaultWorkType);
    setWorkerId(defaultFilter);
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchAttendance(true, {
      siteId: undefined,
      wageTypeId: undefined,
      workTypeId: undefined,
      workerId: undefined,
      date: undefined,
    });
  };

  const handleRefresh = () => {
    fetchAttendance(true);
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await attendanceService.deleteAttendance(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchAttendance(true);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete Attendance';
      toast.error(errorMsg);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => setDeleteConfirmId(null);

  const handleEditAttendance = (id: number) => {
    navigate(AttendanceUrls.edit(id));
  };

  const handlePress = () => {
    navigate(AttendanceUrls.create);
  };

  // Web: replace Alert.alert with dialog state
  const handleWorkTypeChange = (newWorkType: WorkType) => {
    const isSameCategory =
      newWorkType.workerCategoryId === workTypeId.workerCategoryId;
    if (isSameCategory) {
      setWorkTypeId(newWorkType);
      return;
    }
    const hasDependentData = workerId.name !== '';
    if (hasDependentData) {
      setPendingWorkType(newWorkType);
      setIsWorkTypeChangeDialogOpen(true);
    } else {
      setWorkTypeId(newWorkType);
    }
  };

  const confirmWorkTypeChange = () => {
    if (pendingWorkType) {
      setWorkerId(defaultFilter);
      setWorkerList([]);
      setWorkTypeId(pendingWorkType);
      setPendingWorkType(null);
    }
    setIsWorkTypeChangeDialogOpen(false);
  };

  const cancelWorkTypeChange = () => {
    setPendingWorkType(null);
    setIsWorkTypeChangeDialogOpen(false);
  };

  // Dropdown option mappers
  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: {
      value: item.id.toString(),
      name: item.name,
      workerCategoryId: item.workerCategory.id.toString(),
    },
  }));

  const workerDetails = workerList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const wageTypeDetails = wageTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  // Fetch functions
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    const workTypes = await workTypeService.getWorkTypes(searchString);
    if (!workTypes) return;
    setWorkTypeList(searchString ? workTypes.slice(0, 3) : workTypes);
  };

  const fetchWorkers = async (WorkerName: string = '') => {
    const workers = await workerService.getWorkers({
      WorkerName,
      WorkerCategoryId: parseInt(workTypeId.workerCategoryId),
    });
    if (!workers?.items) return;
    setWorkerList(WorkerName ? workers.items.slice(0, 3) : workers.items);
  };

  const fetchWageTypes = async (searchString: string = '') => {
    const wageTypes = await wageTypeService.getWageTypes(searchString);
    if (!wageTypes) return;
    setWageTypeList(searchString ? wageTypes.slice(0, 3) : wageTypes);
  };

  return {
    // list state
    attendance,
    loading,
    paginationLoading,
    hasMore,
    appliedFilters,
    // filter state
    date,
    setDate,
    siteId,
    setSiteId,
    wageTypeId,
    setWageTypeId,
    workTypeId,
    workerId,
    setWorkerId,
    // filter dialog
    isFilterOpen,
    setIsFilterOpen,
    // dropdown options
    siteDetails,
    workTypeDetails,
    wageTypeDetails,
    workerDetails,
    // fetch functions
    fetchSites,
    fetchWageTypes,
    fetchWorkTypes,
    fetchWorkers,
    // actions
    fetchAttendance,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    handlePress,
    handleEditAttendance,
    // delete dialog
    deleteConfirmId,
    confirmDelete,
    handleDelete,
    cancelDelete,
    // work type change dialog
    isWorkTypeChangeDialogOpen,
    handleWorkTypeChange,
    confirmWorkTypeChange,
    cancelWorkTypeChange,
  };
};