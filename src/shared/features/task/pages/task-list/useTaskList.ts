import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useTaskService } from '../../service/TaskService';
import type { Task } from '../../DTOs/TaskProps';
import { TaskUrls } from '../../utils/urls';

const useTaskList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskService = useTaskService();

  const [taskDetails, setTaskDetails] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const taskData = await taskService.getTasks();
      setTaskDetails(Array.isArray(taskData) ? taskData : []);
    } catch {
      toast.error('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchText('');
    fetchTasks();
  }, [location.state?.refresh]);

  const handleTaskSelect = (id: number) => navigate(TaskUrls.edit(id));

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleTaskDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setDeleteId(null);
      fetchTasks();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Task.',
      );
    }
  };

  return {
    taskDetails,
    fetchTasks,
    handleTaskSelect,
    handleTaskDelete,
    confirmDelete,
    deleteId,
    setDeleteId,
    loading,
    searchText,
    setSearchText,
  };
};

export { useTaskList };