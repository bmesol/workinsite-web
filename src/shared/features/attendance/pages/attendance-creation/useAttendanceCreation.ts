import { useEffect, useState } from 'react';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkTypeService } from '@/shared/features/workers/service/WorkerTypeService';
import { useAttendanceInputValidate } from '../../components/InputValidate/AttendanceValidate';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWageTypeService } from '@/shared/features/sites/service/WageTypeService';
import { useAttendanceService } from '@/shared/features/attendance/service/AttendanceService';
import { useWorkQuantityReportService } from '@/shared/features/workers/service/WorkQuantityReportService';
import type { WorkQuantityReportItem } from '@/shared/features/workers/service/WorkQuantityReportService';
import type { AttendanceSplit } from '../../DTOs/AttendanceProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { WageType, Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';
import { formatDateToString } from '../../utils/functions';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

type UploadedImage = {
  uri: string;    // blob URL from URL.createObjectURL()
  type: string;
  name: string;
  file: File;     // original File object for FormData
};

interface WorkType {
  id: number;
  name: string;
  workerCategory: {
    id: number;
    name: string;
    note: string;
  };
}

const defaultWorkType: WorkType = {
  name: '',
  id: 0,
  workerCategory: {
    id: 0,
    name: '',
    note: '',
  },
};

const useAttendanceCreation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectParams = location.state?.redirectParams || {};
  const redirect = location.state?.redirect || null;

  const [siteId, setSiteId] = useState<string>(redirectParams?.siteId || '');
  const [workType, setWorkType] = useState<WorkType>(defaultWorkType);
  const [workerId, setWorkerId] = useState<string>('');
  const [wageTypeId, setWageTypeId] = useState<string>('');
  const [workModeId, setWorkModeId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [workedQuantity, setWorkedQuantity] = useState<string>('');

  const [siteList, setSiteList] = useState<Site[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [attendanceSplit, setAttendanceSplit] = useState<AttendanceSplit[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [workQuantityReport, setWorkQuantityReport] = useState<WorkQuantityReportItem | null>(null);

  // Web: dialog open states replace bottomSheetRef / imageSheetRef
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [isWorkTypeChangeDialogOpen, setIsWorkTypeChangeDialogOpen] = useState(false);
  const [pendingWorkType, setPendingWorkType] = useState<WorkType | null>(null);

  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const workModeService = useWorkModeService();
  const workerService = useWorkerService();
  const wageTypeService = useWageTypeService();
  const attendanceService = useAttendanceService();
  const workQuantityReportService = useWorkQuantityReportService();

  const today = new Date();
  const formatted = formatDateToString(today);

  // Fetch site by redirectParam on mount
  useEffect(() => {
    const fetchSiteById = async () => {
      if (redirectParams?.siteId) {
        try {
          const fetchedSite = await siteService.getSite(
            parseInt(redirectParams.siteId),
          );
          setSiteId(fetchedSite?.id?.toString());
          setSiteList([fetchedSite]);
          setWageTypeId(fetchedSite.wageType.id.toString());
          setWageTypeList([fetchedSite.wageType]);
        } catch (error) {
          console.error('Failed to fetch Site:', error);
        }
      }
    };
    fetchSiteById();
  }, []);

  // Reset form on mount
  useEffect(() => {
    resetFormFields();
  }, []);

  const { error, validate, setError, initialError } =
    useAttendanceInputValidate({
      date,
      siteId,
      wageTypeId,
      workTypeId: workType?.id?.toString(),
      workerId,
      workedQuantity,
      workModeId,
      attendanceSplit,
    });

  // Dropdown option mappers
  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

 const workTypeDetails = workTypeList.map(item => ({
  label: item.name,
  value: item.id.toString(),
  allItems: {
    value: item.id.toString(),
    name: item.name,
    id: item.id,
    workerCategory: {
      id: item.workerCategory.id,
      name: item.workerCategory.name,
      note: item.workerCategory.note,
    },
  },
}));

  const workerDetails = workerList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
    value: item.id.toString(),
  }));

  const wageTypeDetails = wageTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // Fetch functions
  const fetchSites = async (searchString: string = '') => {
    let source = allSites;
    if (!source.length) {
      const sites = await siteService.getSites({ status: 'Working' });
      if (!sites) return;
      setAllSites(sites);
      source = sites;
    }
    const lower = searchString.toLowerCase();
    setSiteList(
      searchString ? source.filter(s => s.name.toLowerCase().includes(lower)) : source,
    );
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    const workTypes = await workTypeService.getWorkTypes(searchString);
    if (!workTypes) return;
    setWorkTypeList(searchString ? workTypes.slice(0, 3) : workTypes);
  };

const fetchWorkers = async (WorkerName: string = '') => {
  const workers = await workerService.getWorkers({
    WorkerName,
    WorkerCategoryId: workType.workerCategory.id || undefined,
  });

  console.log("workers response:", workers);

  if (!workers) return;
  setWorkerList(WorkerName ? workers.slice(0, 3) : workers);
};
  const fetchWageTypes = async (searchString: string = '') => {
    const wageTypes = await wageTypeService.getWageTypes(searchString);
    if (!wageTypes) return;
    setWageTypeList(searchString ? wageTypes.slice(0, 3) : wageTypes);
  };

  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    if (!workModes) return;
    setWorkModeList(searchString ? workModes.slice(0, 3) : workModes);
  };

  // Fetches worked-vs-estimated quantity for the current site + work type + work mode
  const fetchWorkQuantityReport = async (
    currentSiteId: string,
    currentWorkTypeId: number,
    currentWorkModeId: string,
  ) => {
    if (!currentSiteId || !currentWorkTypeId || !currentWorkModeId) {
      setWorkQuantityReport(null);
      return;
    }
    try {
      const result = await workQuantityReportService.getWorkQuantityReports({
        SiteId: parseInt(currentSiteId),
        WorkTypeId: currentWorkTypeId,
        WorkModeId: parseInt(currentWorkModeId),
      });
      const item = result?.items?.[0] ?? null;
      setWorkQuantityReport(item);
    } catch (error) {
      console.error('Failed to fetch Work Quantity Report:', error);
      setWorkQuantityReport(null);
    }
  };

  useEffect(() => {
    fetchWorkQuantityReport(siteId, workType.id, workModeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, workType.id, workModeId]);

  const resetFormFields = () => {
    setSiteId('');
    setWorkType(defaultWorkType);
    setWorkTypeList([]);
    setWorkerId('');
    setWageTypeId('');
    setWorkModeId('');
    setNotes('');
    setWorkedQuantity('');
    setDate(formatted);
    setUploadedImages([]);
    setAttendanceSplit([]);
    setError(initialError);
    setWorkQuantityReport(null);
    setAllSites([]);
  };

  const handleNavigate = () => {
    setError(initialError);
    if (redirect) {
      navigate(redirect, { state: { ...redirectParams } });
    } else {
      navigate('/attendance');
    }
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== '' ||
      workType.name !== '' ||
      workerId !== '' ||
      wageTypeId !== '' ||
      workModeId !== '' ||
      notes !== '' ||
      date !== formatted ||
      workedQuantity !== '' ||
      uploadedImages.length > 0 ||
      attendanceSplit.length > 0
    );
  };

  // Web: replace Alert.alert with dialog state
  const handleWorkTypeChange = (newWorkType: WorkType) => {
    const isSameCategory =
      newWorkType.workerCategory.id === workType.workerCategory.id;
    if (isSameCategory) {
      setWorkType(newWorkType);
      return;
    }
    const hasDependentData = workerId !== '' || attendanceSplit.length > 0;
    if (hasDependentData) {
      setPendingWorkType(newWorkType);
      setIsWorkTypeChangeDialogOpen(true);
    } else {
      setWorkType(newWorkType);
    }
  };

  const confirmWorkTypeChange = () => {
    if (pendingWorkType) {
      setWorkerId('');
      setWorkerList([]);
      setAttendanceSplit([]);
      setWorkType(pendingWorkType);
      setPendingWorkType(null);
    }
    setIsWorkTypeChangeDialogOpen(false);
  };

  const cancelWorkTypeChange = () => {
    setPendingWorkType(null);
    setIsWorkTypeChangeDialogOpen(false);
  };

  // Web: replace Alert.alert with dialog state for delete
  const confirmDelete = (index: number) => {
    setDeleteConfirmIndex(index);
  };

  const handleDelete = () => {
    if (deleteConfirmIndex === null) return;
    const updated = [...attendanceSplit];
    updated.splice(deleteConfirmIndex, 1);
    setAttendanceSplit(updated);
    setDeleteConfirmIndex(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmIndex(null);
  };

  // Web: replace launchImageLibrary + ImageResizer with <input type="file">
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      uri: URL.createObjectURL(file),
      type: file.type || 'image/jpeg',
      name: file.name || `photo_${Date.now()}.jpg`,
      file,
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
    setIsImageDialogOpen(false);

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const deleteImage = (index: number) => {
    const updated = [...uploadedImages];
    // Revoke blob URL to free memory
    URL.revokeObjectURL(updated[index].uri);
    updated.splice(index, 1);
    setUploadedImages(updated);
  };

// ✅ Coordinates → Address convert பண்ற function
const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return data.display_name || `${lat}, ${lng}`;
  } catch {
    return `${lat}, ${lng}`; // fallback
  }
};

const handleSubmit = async () => {
  if (validate()) {
    try {
      // ✅ Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // ✅ Get address
      const address = await getAddressFromCoords(lat, lng);

      const formData = new FormData();

      formData.append('Date', date);
      formData.append('SiteId', String(parseInt(siteId)));
      formData.append('WageTypeId', String(parseInt(wageTypeId)));
      formData.append('WorkTypeId', String(workType.id));
      formData.append('WorkerId', String(parseInt(workerId)));
      formData.append('WorkedQuantity', workedQuantity.toString());
      formData.append('WorkModeId', String(parseInt(workModeId)));

      // ✅ Location with address
      formData.append('CurrentLocation.Lat', lat.toString());
      formData.append('CurrentLocation.Lng', lng.toString());
      formData.append('CurrentLocation.Address', address); // ✅ real address

      attendanceSplit.forEach((split, index) => {
        formData.append(`AttendanceSplits[${index}].WorkerRoleId`, String(split.workerRole.id));
        formData.append(`AttendanceSplits[${index}].ShiftId`, String(split.shift.id));
        formData.append(`AttendanceSplits[${index}].NoOfPersons`, String(split.noOfPersons));
      });

      if (notes) formData.append('Note', notes.trim());

      if (uploadedImages.length > 0) {
        uploadedImages.forEach(img => {
          formData.append('Images', img.file, img.name);
        });
      }

      await attendanceService.createAttendance(formData);
      resetFormFields();
      handleNavigate();

    } catch (error: any) {
      if (error?.code === 1) {
        toast.error('Location permission denied. Please allow location access.');
        return;
      }
      const errorMsg = error?.response?.data?.[0]?.message || 'Failed to create Attendance';
      toast.error(errorMsg);
    }
  }
};

  // Worked-vs-estimated indicator (mirrors mobile app behaviour)
  const selectedWorkModeName = workModeList.find(wm => wm.id.toString() === workModeId)?.name ?? '';
  const isPlannedWork = selectedWorkModeName.toLowerCase().includes('planned');
  const workedQtyNum = parseFloat(workQuantityReport?.workedQuantity ?? '0');
  const estimatedQtyNum = parseFloat(workQuantityReport?.estimatedQuantity ?? '0');
  const currentQty = parseFloat(workedQuantity) || 0;
  const newTotal = workedQtyNum + currentQty;
  const isOverEstimate = isPlannedWork && newTotal >= estimatedQtyNum;
  const workQuantityIndicator = workQuantityReport
    ? {
        text: isPlannedWork
          ? `${newTotal} / ${estimatedQtyNum} Estimated — ${isOverEstimate ? 'Exceeds plan!' : 'On track'}`
          : `Total Worked: ${newTotal}`,
        color: isOverEstimate ? '#e74c3c' : '#1a73e8',
      }
    : null;

  return {
    // form state
    siteId,
    workType,
    workerId,
    wageTypeId,
    workModeId,
    notes,
    workedQuantity,
    date,
    attendanceSplit,
    uploadedImages,
    error,
    // dropdown options
    siteDetails,
    workTypeDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    // setters
    setSiteId,
    setWorkType,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    setWorkedQuantity,
    setDate,
    setAttendanceSplit,
    setUploadedImages,
    // fetch functions
    fetchSites,
    fetchWorkTypes,
    fetchWorkers,
    fetchWageTypes,
    fetchWorkModes,
    // actions
    handleSubmit,
    resetFormFields,
    hasUnsavedChanges,
    handleNavigate,
    handleImageUpload,
    deleteImage,
    // delete split dialog
    deleteConfirmIndex,
    confirmDelete,
    handleDelete,
    cancelDelete,
    // split dialog
    isSplitDialogOpen,
    setIsSplitDialogOpen,
    // image dialog
    isImageDialogOpen,
    setIsImageDialogOpen,
    // work type change dialog
    isWorkTypeChangeDialogOpen,
    confirmWorkTypeChange,
    cancelWorkTypeChange,
    handleWorkTypeChange,
    // work quantity / estimated plan indicator
    workQuantityIndicator,
  };
};

export { useAttendanceCreation };