import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useTaskService } from '../../service/TaskService';
import { useTaskInputValidate } from '../../components/InputValidate/TaskInputValidate';
import { priorityTaskType, statusTaskType } from '../../DTOs/TaskProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { TaskUrls } from '../../utils/urls';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

export const useTaskCreation = () => {
  const navigate = useNavigate();
  const siteService = useSiteService();
  const taskService = useTaskService();

  const [siteId, setSiteId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState<string>('Urgent');
  const [status, setStatus] = useState<string>('Open');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [supervisorId, setSupervisorId] = useState('');
  const [supervisorList, setSupervisorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const { error, validate, setError, initialError } = useTaskInputValidate({
    taskName,
    siteId,
    date,
    priority,
    status,
    supervisorId,
  });

  const priorityType = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Ordinary', value: 'Ordinary' },
  ];

  const workflowStatus = [
    { label: 'Open', value: 'Open' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Closed', value: 'Closed' },
  ];

  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({
      searchString,
      status: 'Working',
    });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const handleSiteChange = (id: string) => {
    setSiteId(id);
    setSupervisorId('');
    const selectedSite = siteList.find(site => site.id.toString() === id);
    if (selectedSite?.supervisors) {
      const onlySupervisors = selectedSite.supervisors.filter(
        user => user.role?.name === 'Supervisor',
      );
      setSupervisorList(onlySupervisors);
    } else {
      setSupervisorList([]);
    }
  };

  const supervisorDetails = supervisorList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const resetFormFields = useCallback(() => {
    setSiteId('');
    setTaskName('');
    setDate('');
    setPriority('Urgent');
    setStatus('Open');
    setError(initialError);
    setSupervisorId('');
    setRemarks('');
    setUploadedImages([]);
  }, []);

  const hasUnsavedChanges = () => {
    return (
      siteId !== '' ||
      taskName !== '' ||
      date !== '' ||
      priority !== 'Urgent' ||
      status !== 'Open' ||
      supervisorId !== '' ||
      remarks !== '' ||
      uploadedImages.length > 0
    );
  };

  // ── Image compression ─────────────────────────────────────────────────
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
    } catch {
      toast.error('An error occurred while processing images.');
    }
    if (e.target) e.target.value = '';
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmission = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('SiteId', parseInt(siteId).toString());
      form.append('SupervisorId', parseInt(supervisorId).toString());
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
      form.append('Remark', remarks.trim());

      uploadedImages.forEach(img => {
        if (img.file) form.append('Images', img.file);
      });

      await taskService.createTask(form);
      resetFormFields();
      navigate(TaskUrls.list);
      toast.success('Task created successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create Task');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = useCallback(() => {
    if (hasUnsavedChanges()) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?',
      );
      if (confirmLeave) {
        resetFormFields();
        navigate(TaskUrls.list);
      }
    } else {
      resetFormFields();
      navigate(TaskUrls.list);
    }
  }, [hasUnsavedChanges, navigate]);

  return {
    siteId,
    setSiteId,
    taskName,
    setTaskName,
    navigate,
    date,
    setDate,
    status,
    setStatus,
    priority,
    setPriority,
    workflowStatus,
    priorityType,
    remarks,
    setRemarks,
    error,
    siteDetails,
    fetchSites,
    handleSubmission,
    handleBackPress,
    hasUnsavedChanges,
    handleSiteChange,
    supervisorId,
    setSupervisorId,
    supervisorDetails,
    loading,
    uploadedImages,
    setUploadedImages,
    handleFileChange,
  };
};