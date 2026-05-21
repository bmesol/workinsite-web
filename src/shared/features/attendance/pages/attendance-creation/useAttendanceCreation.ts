import { useEffect, useState } from 'react';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkTypeService } from '@/shared/features/workers/service/WorkerTypeService';
import { useUnitService } from '@/shared/features/materials/service/UnitService';
import { useAttendanceInputValidate } from '../../components/InputValidate/AttendanceValidate';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWageTypeService } from '@/shared/features/sites/service/WageTypeService';
import { useAttendanceService } from '@/shared/features/attendance/service/AttendanceService';
import type { AttendanceSplit } from '../../DTOs/AttendanceProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Unit } from '@/shared/features/materials/DTOs/UnitProps';
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
  const [unitId, setUnitId] = useState<string>('');
  const [workerId, setWorkerId] = useState<string>('');
  const [wageTypeId, setWageTypeId] = useState<string>('');
  const [workModeId, setWorkModeId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [workedQuantity, setWorkedQuantity] = useState<string>('');

  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [attendanceSplit, setAttendanceSplit] = useState<AttendanceSplit[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Web: dialog open states replace bottomSheetRef / imageSheetRef
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [isWorkTypeChangeDialogOpen, setIsWorkTypeChangeDialogOpen] = useState(false);
  const [pendingWorkType, setPendingWorkType] = useState<WorkType | null>(null);

  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const unitService = useUnitService();
  const workModeService = useWorkModeService();
  const workerService = useWorkerService();
  const wageTypeService = useWageTypeService();
  const attendanceService = useAttendanceService();

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
      unitId,
      workModeId,
      attendanceSplit,
    });

  // Dropdown option mappers
  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: `${item.name} [${item.workerCategory.name}]`,
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

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
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
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    const workTypes = await workTypeService.getWorkTypes(searchString);
    if (!workTypes) return;
    setWorkTypeList(searchString ? workTypes.slice(0, 3) : workTypes);
  };

  const fetchUnits = async (searchString: string = '') => {
    const units = await unitService.getUnits(searchString, false);
    if (!units) return;
    setUnitList(searchString ? units.slice(0, 3) : units);
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

  const resetFormFields = () => {
    setSiteId('');
    setWorkType(defaultWorkType);
    setWorkTypeList([]);
    setUnitId('');
    setWorkerId('');
    setWageTypeId('');
    setWorkModeId('');
    setNotes('');
    setWorkedQuantity('');
    setDate(formatted);
    setUploadedImages([]);
    setAttendanceSplit([]);
    setError(initialError);
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
      unitId !== '' ||
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
        formData.append('SiteId', String(parseInt(siteId)));
        formData.append('WageTypeId', String(parseInt(wageTypeId)));
        formData.append('WorkTypeId', String(workType.id));
        formData.append('WorkerId', String(parseInt(workerId)));
        formData.append('WorkedQuantity', workedQuantity.toString());
        formData.append('UnitId', String(parseInt(unitId)));
        formData.append('WorkModeId', String(parseInt(workModeId)));

        formattedAttendanceSplits.forEach((split, index) => {
          formData.append(`AttendanceSplits[${index}].WorkerRoleId`, String(split.workerRoleId));
          formData.append(`AttendanceSplits[${index}].ShiftId`, String(split.shiftId));
          formData.append(`AttendanceSplits[${index}].NoOfPersons`, String(split.noOfPersons));
        });

        if (notes) formData.append('Note', notes.trim());

        // Web: append File objects directly
        if (uploadedImages.length > 0) {
          uploadedImages.forEach(img => {
            formData.append('Images', img.file, img.name);
          });
        }

        await attendanceService.createAttendance(formData);
        resetFormFields();
        handleNavigate();
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to create Attendance';
        toast.error(errorMsg);
      }
    }
  };

  return {
    // form state
    siteId,
    workType,
    unitId,
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
    unitDetails,
    workerDetails,
    wageTypeDetails,
    workModeDetails,
    // setters
    setSiteId,
    setWorkType,
    setUnitId,
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
    fetchUnits,
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
  };
};

export { useAttendanceCreation };