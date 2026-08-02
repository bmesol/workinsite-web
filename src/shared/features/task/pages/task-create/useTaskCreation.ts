import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

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

  // ── Prefill from navigation state (equivalent of mobile's route.params) ──
  useEffect(() => {
    if (location.state?.siteId) {
      setSiteId(location.state.siteId);
    }
    if (location.state?.supervisorId) {
      setSupervisorId(location.state.supervisorId);
    }
  }, [location.state]);

  // Tracks the most recently *fired* search request so we can drop any
  // response that resolves out of order (e.g. an earlier keystroke's
  // request completing after a later one) instead of letting it
  // overwrite siteList with stale data.
  const fetchSitesRequestId = useRef(0);

  const fetchSites = async (searchString: string = '') => {
    const requestId = ++fetchSitesRequestId.current;
    const sites = await siteService.getSites({
      searchString,
      status: 'Working',
    });
    if (!sites) return;
    // A newer request has since been fired — ignore this stale response.
    if (requestId !== fetchSitesRequestId.current) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const handleSiteChange = async (id: string) => {
    setSiteId(id);
    setSupervisorId('');
    setSupervisorList([]);

    if (!id) return;

    try {
      // The list/search response for a site may not include the nested
      // `supervisors` array (e.g. a lighter DTO for autocomplete results),
      // so fetch the full site detail directly to get reliable data.
      const site = await siteService.getSite(parseInt(id));
      // NOTE: mobile does not filter this by role name — everyone linked
      // to the site under `supervisors` is eligible for assignment.
      setSupervisorList(site?.supervisors || []);
    } catch {
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
      form.append('AssignedToId', parseInt(supervisorId).toString());
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

  // ── Back / Cancel (mirrors mobile's 3-option Alert via a dialog) ───────
  const handleBackPress = useCallback(() => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(TaskUrls.list);
    }
  }, [hasUnsavedChanges, navigate, resetFormFields]);

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
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};