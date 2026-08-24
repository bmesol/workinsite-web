import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkTypeService } from '@/shared/features/workers/service/WorkerTypeService';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWageTypeService } from '@/shared/features/sites/service/WageTypeService';
import { useAttendanceService } from '../../service/AttendanceService';
import { useWorkQuantityReportService } from '@/shared/features/workers/service/WorkQuantityReportService';
import type { WorkQuantityReportItem } from '@/shared/features/workers/service/WorkQuantityReportService';
import { toast } from 'sonner';
import { AttendanceUrls } from '../../utils/urls';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { WageType, Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';
import type { AttendanceProps, AttendanceSplit } from '../../DTOs/AttendanceProps';
import { useAttendanceInputValidate } from '../../components/InputValidate/AttendanceValidate';

type UploadedImage = {
  uri: string;
  type: string;
  name: string;
  file: File;
};

type ViewImages = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
};

type RemoveImages = {
  id: number;
  imagePath: string;
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
  workerCategory: { id: 0, name: '', note: '' },
};

const useAttendanceEditScreen = () => {
  const { id: attendanceId } = useParams<string>();          // ✅ route.params → useParams
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const navigate = useNavigate();

  const [siteId, setSiteId] = useState<string>('');
  const [workType, setWorkType] = useState<WorkType>(defaultWorkType);
  const [workerId, setWorkerId] = useState<string>('');
  const [wageTypeId, setWageTypeId] = useState<string>('');
  const [workModeId, setWorkModeId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [workedQuantity, setWorkedQuantity] = useState<string>('');
  const originalWorkedQtyRef = useRef<number>(0);

  const [siteList, setSiteList] = useState<Site[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [attendanceSplit, setAttendanceSplit] = useState<AttendanceSplit[]>([]);
  const [attendance, setAttendance] = useState<AttendanceProps>();
  const [loading, setLoading] = useState(true);
  const [workQuantityReport, setWorkQuantityReport] = useState<WorkQuantityReportItem | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [viewImages, setViewImages] = useState<ViewImages[]>([]);
  const [removeImages, setRemoveImages] = useState<RemoveImages[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null); // ✅ Alert → dialog state

  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const workModeService = useWorkModeService();
  const workerService = useWorkerService();
  const wageTypeService = useWageTypeService();
  const attendanceService = useAttendanceService();
  const workQuantityReportService = useWorkQuantityReportService();

  const { error, validate, setError, initialError } = useAttendanceInputValidate({
    date,
    siteId,
    wageTypeId,
    workTypeId: workType?.id?.toString(),
    workerId,
    workedQuantity,
    workModeId,
    attendanceSplit,
  });

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
      WorkerCategoryId: workType.workerCategory.id,
    });
    if (!workers?.items) return;
    setWorkerList(WorkerName ? workers.items.slice(0, 3) : workers.items);
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
      setWorkQuantityReport(result?.items?.[0] ?? null);
    } catch (error: any) {
      setWorkQuantityReport(null);
      toast.error(error?.response?.data?.message || 'Failed to fetch work quantity report');
    }
  };

  useEffect(() => {
    fetchWorkQuantityReport(siteId, workType.id, workModeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, workType.id, workModeId]);

  // ✅ Alert.alert → deleteIndex state — UI la confirm dialog
  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedAttendance = [...attendanceSplit];
    updatedAttendance.splice(index, 1);
    setAttendanceSplit(updatedAttendance);
    setDeleteIndex(null);
  };

  const cancelDelete = () => setDeleteIndex(null);

  const resetFormFields = () => {
    setSiteId('');
    setWorkType(defaultWorkType);
    setWorkerId('');
    setWageTypeId('');
    setWorkModeId('');
    setNotes('');
    setDate('');
    setWorkedQuantity('');
    setUploadedImages([]);
    setViewImages([]);
    setRemoveImages([]);
    setAttendanceSplit([]);
    setError(initialError);
    setWorkQuantityReport(null);
    setAllSites([]);
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== attendance?.site?.id?.toString() ||
      workType?.id?.toString() !== attendance?.workType?.id?.toString() ||
      workerId !== attendance?.worker?.id?.toString() ||
      wageTypeId !== attendance?.wageType?.id?.toString() ||
      workModeId !== attendance?.workMode?.id?.toString() ||
      notes !== attendance?.notes ||
      date !== attendance?.date ||
      workedQuantity !== attendance?.workedQuantity ||
      !arraysEqual(attendanceSplit, attendance?.attendanceSplits ?? []) ||
      uploadedImages?.length > 0 ||
      removeImages?.length > 0 ||
      viewImages?.length !== attendance?.images?.length
    );
  };

  const arraysEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const handleNavigateAfterSave = () => {
    if (redirect) {
      navigate(redirect);
    } else {
      navigate(AttendanceUrls.list);
    }
    setError(initialError);
  };

  // ✅ Alert.alert → window.confirm
  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Click OK to exit without saving, or Cancel to stay.',
      );
      if (confirmed) {
        resetFormFields();
        handleNavigateAfterSave();
      }
    } else {
      resetFormFields();
      handleNavigateAfterSave();
    }
  };

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
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const formattedAttendanceSplits = attendanceSplit.map(split => ({
          workerRoleId: split.workerRole.id,
          shiftId: split.shift.id,
          noOfPersons: split.noOfPersons,
        }));

        const formData = new FormData();

        formData.append('Date', date);
        formData.append('SiteId', parseInt(siteId).toString());
        formData.append('WageTypeId', parseInt(wageTypeId).toString());
        formData.append('WorkTypeId', workType?.id.toString());
        formData.append('WorkerId', parseInt(workerId).toString());
        formData.append('WorkedQuantity', workedQuantity.toString());
        formData.append('WorkModeId', parseInt(workModeId).toString());

        formattedAttendanceSplits.forEach((split, index) => {
          formData.append(`AttendanceSplits[${index}].WorkerRoleId`, split.workerRoleId.toString());
          formData.append(`AttendanceSplits[${index}].ShiftId`, split.shiftId.toString());
          formData.append(`AttendanceSplits[${index}].NoOfPersons`, String(split.noOfPersons));
        });

        removeImages.forEach((image, index) => {
          formData.append(`RemovedImages[${index}].Id`, image.id.toString());
          formData.append(`RemovedImages[${index}].ImagePath`, image.imagePath);
        });

        if (notes) formData.append('Note', notes.trim());

        uploadedImages.forEach(img => {
          if (img.file) formData.append('Images', img.file);
        });

        await new Promise<void>((resolve, reject) => {
          if (!navigator.geolocation) {
            formData.append('CurrentLocation.Lat', '0');
            formData.append('CurrentLocation.Lng', '0');
            formData.append('CurrentLocation.Address', '');
            resolve();
            return;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude.toString();
              const lng = position.coords.longitude.toString();

              try {
                const res = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await res.json();
                const address = data.display_name || '';
                formData.append('CurrentLocation.Lat', lat);
                formData.append('CurrentLocation.Lng', lng);
                formData.append('CurrentLocation.Address', address);
              } catch {
                formData.append('CurrentLocation.Lat', lat);
                formData.append('CurrentLocation.Lng', lng);
                formData.append('CurrentLocation.Address', '');
              }
              resolve();
            },
            () => {
              formData.append('CurrentLocation.Lat', '0');
              formData.append('CurrentLocation.Lng', '0');
              formData.append('CurrentLocation.Address', '');
              resolve();
            }
          );
        });

        await attendanceService.updateAttendance(parseInt(attendanceId!), formData);
        resetFormFields();
        handleNavigateAfterSave();
      } catch (error: any) {
        const errorMsg = error?.response?.data?.[0]?.message || 'Failed to Edit Attendance';
        toast.error(errorMsg);
      }
    }
  };

  useEffect(() => {
    const fetchattendance = async () => {
      setLoading(true);
      try {
        const attendanceData: AttendanceProps =
          await attendanceService.getAttendance(parseInt(attendanceId!));
        setAttendance(attendanceData);
        setDate(attendanceData.date);
        setWageTypeList([attendanceData.wageType]);
        setWageTypeId(attendanceData.wageType.id.toString());
        setSiteId(attendanceData.site.id.toString());
        setSiteList([attendanceData.site]);
        setWorkType(attendanceData.workType);
        setWorkTypeList([attendanceData.workType]);
        setWorkerId(attendanceData.worker.id.toString());
        setWorkerList([attendanceData.worker]);
        setWorkModeId(attendanceData.workMode.id.toString());
        setWorkModeList([attendanceData.workMode]);
        setAttendanceSplit(attendanceData.attendanceSplits);
        setWorkedQuantity(attendanceData.workedQuantity.toString());
        originalWorkedQtyRef.current = parseFloat(attendanceData.workedQuantity.toString()) || 0;
        setViewImages(attendanceData.images ?? []);
        setNotes(attendanceData.notes);
      } catch (error) {
        toast.error('Failed to fetch Attendance data.');
      } finally {
        setLoading(false);
      }
    };

    if (attendanceId) fetchattendance();
  }, [attendanceId]);

  // Worked-vs-estimated indicator (mirrors mobile app behaviour)
  const selectedWorkModeName = workModeList.find(wm => wm.id.toString() === workModeId)?.name ?? '';
  const isPlannedWork = selectedWorkModeName.toLowerCase().includes('planned');
  const workedQtyNum = parseFloat(workQuantityReport?.workedQuantity ?? '0');
  const estimatedQtyNum = parseFloat(workQuantityReport?.estimatedQuantity ?? '0');
  const currentQty = parseFloat(workedQuantity) || 0;
  const newTotal = workedQtyNum - originalWorkedQtyRef.current + currentQty;
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
    siteDetails,
    workTypeDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    error,
    siteId,
    workType,
    workerId,
    wageTypeId,
    workModeId,
    notes,
    workedQuantity,
    date,
    attendanceSplit,
    loading,
    uploadedImages,
    setUploadedImages,
    setAttendanceSplit,
    setDate,
    setWorkedQuantity,
    setSiteId,
    setWorkType,
    setWorkerId,
    setWageTypeId,
    setWorkModeId,
    setNotes,
    fetchSites,
    fetchWorkTypes,
    fetchWorkers,
    fetchWageTypes,
    fetchWorkModes,
    handleBackPress,
    handleSubmit,
    hasUnsavedChanges,
    confirmDelete,
    handleDelete,
    cancelDelete,
    deleteIndex,
    handleImageUpload,
    viewImages,
    setViewImages,
    removeImages,
    setRemoveImages,
    workQuantityIndicator,
  };
};

export { useAttendanceEditScreen };