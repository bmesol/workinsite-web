import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTaskService } from '../../service/TaskService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useTaskInputValidate } from '../../components/InputValidate/TaskInputValidate';
import { priorityTaskType, statusTaskType } from '../../DTOs/TaskProps';
import type { Task } from '../../DTOs/TaskProps';
import { TaskUrls } from '../../utils/urls';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

type ShowImage = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
};

type RemovedImages = {
  id: number;
  imagePath: string;
};

export const useTaskEdit = (id: string) => {
  const navigate = useNavigate();
  const taskService = useTaskService();
  const siteService = useSiteService();

  const [taskName, setTaskName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState<any[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [siteList, setSiteList] = useState<any[]>([]);
  const [supervisorList, setSupervisorList] = useState<any[]>([]);
  const [taskDetails, setTaskDetails] = useState<Task>();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImage, setShowImage] = useState<ShowImage[]>([]);
  const [removedImages, setRemovedImages] = useState<RemovedImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);

  const priorityType = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Ordinary', value: 'Ordinary' },
  ];

  const workflowStatus = [
    { label: 'Open', value: 'Open' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Closed', value: 'Closed' },
  ];

  const { error, validate, setError, initialError } = useTaskInputValidate({
    taskName,
    siteId,
    date,
    priority,
    status,
    supervisorId,
  });

  // ── Image sheet (replaces RN bottom sheet) ──────────────────────────────
  const handleImageSheetOpen = () => setIsImageSheetOpen(true);
  const handleImageSheetClose = () => setIsImageSheetOpen(false);

  // ── Fetch task ────────────────────────────────────────────────────────
  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(parseInt(id));
      setTaskDetails(data);

      const supervisors =
        data.site?.supervisors?.filter(
          (u: any) => u.role?.name === 'Supervisor',
        ) || [];

      setSupervisorList(supervisors);
      setTaskName(data.taskName);
      setSiteId(String(data.site?.id));
      setSiteList([data.site]);
      setSupervisorId(String(data.supervisor?.id));
      setDate(data.date);
      setPriority(data.priority);
      setStatus(data.status);
      setRemarks(data.remarks || []);
      setShowImage(data.images || []);
    } catch (e) {
      toast.error('Failed to fetch task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  // ── Fetch sites ───────────────────────────────────────────────────────
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSiteChange = (newSiteId: string) => {
    setSiteId(newSiteId);
    setSupervisorId('');
    const selectedSite = siteList.find(s => s.id.toString() === newSiteId);
    if (selectedSite?.supervisors) {
      const onlySupervisors = selectedSite.supervisors.filter(
        (u: any) => u.role?.name === 'Supervisor',
      );
      setSupervisorList(onlySupervisors);
    } else {
      setSupervisorList([]);
    }
  };

  const taskCreatorId = remarks[0]?.createdBy;

  const resetFormFields = () => {
    setUploadedImages([]);
    setShowImage([]);
    setRemovedImages([]);
    setError(initialError);
    setNewRemark('');
  };

  // ── Unsaved changes ──────────────────────────────────────────────────────
  const hasUnsavedChanges = useCallback(() => {
    const imagesChanged =
      uploadedImages.length > 0 ||
      removedImages.length > 0 ||
      JSON.stringify(showImage) !== JSON.stringify(taskDetails?.images);

    return (
      taskName !== taskDetails?.taskName ||
      siteId !== taskDetails?.site?.id?.toString() ||
      supervisorId !== taskDetails?.supervisor?.id?.toString() ||
      date !== taskDetails?.date ||
      priority !== taskDetails?.priority ||
      status !== taskDetails?.status ||
      newRemark !== '' ||
      imagesChanged
    );
  }, [
    taskName, siteId, supervisorId, date, priority, status, newRemark,
    uploadedImages, removedImages, showImage, taskDetails,
  ]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(TaskUrls.list);
    }
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const supervisorDetails = supervisorList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // ── Web file picker (replaces launchImageLibrary + ImageResizer) ────────
  const compressImageToWebP = (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const MAX_WIDTH = 1080;
        const MAX_HEIGHT = 1920;

        let { width, height } = img;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (!blob) return reject(new Error('Compression failed'));
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              { type: 'image/webp' },
            );
            resolve({
              uri: URL.createObjectURL(compressedFile),
              name: compressedFile.name,
              type: 'image/webp',
              file: compressedFile,
            });
            URL.revokeObjectURL(objectUrl);
          },
          'image/webp',
          0.8,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image load error'));
      };

      img.src = objectUrl;
    });
  };

  const handleImageUpload = () => {
    handleImageSheetClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      toast.info('No image selected.');
      return;
    }

    try {
      const compressed = await Promise.all(
        files.map(file => compressImageToWebP(file)),
      );
      setUploadedImages(prev => [...prev, ...compressed]);
    } catch (err) {
      toast.error('An error occurred while processing images.');
    }

    if (e.target) e.target.value = '';
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmission = async () => {
    try {
      if (!validate()) return;

      const form = new FormData();
      form.append('SiteId', siteId);
      form.append('SupervisorId', supervisorId);
      form.append('TaskName', taskName.trim());
      form.append('Date', date.trim());
      form.append(
        'Priority',
        String(priorityTaskType[priority as keyof typeof priorityTaskType]),
      );
      form.append(
        'Status',
        String(statusTaskType[status as keyof typeof statusTaskType]),
      );
      form.append('Remark', newRemark || '');

      uploadedImages.forEach(img => {
        if (img.file) form.append('Images', img.file);
      });

      removedImages.forEach((img, i) => {
        form.append(`RemovedImages[${i}].id`, String(img.id));
        form.append(`RemovedImages[${i}].imagePath`, img.imagePath);
      });

      await taskService.updateTask(parseInt(id), form);

      toast.success('Task updated successfully.');
      navigate(TaskUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Update failed.',
      );
    }
  };

  return {
    taskName, setTaskName,
    siteId, setSiteId,
    supervisorId, setSupervisorId,
    date, setDate,
    priority, setPriority,
    status, setStatus,
    remarks, setRemarks,
    siteList,
    supervisorList,
    handleSiteChange,
    handleSubmission,
    handleImageUpload,
    handleFileChange,
    uploadedImages,
    setUploadedImages,
    showImage, setShowImage,
    removedImages, setRemovedImages,
    loading,
    workflowStatus,
    priorityType,
    error,
    fetchSites,
    handleBack,
    hasUnsavedChanges,
    isImageSheetOpen,
    handleImageSheetOpen,
    handleImageSheetClose,
    siteDetails,
    supervisorDetails,
    taskDetails,
    newRemark, setNewRemark,
    taskCreatorId,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchTask,
    resetFormFields,
    setError,
    initialError,
  };
};