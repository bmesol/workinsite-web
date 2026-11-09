import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useWorkRateAbstractService } from '../../service/WorkRateAbstractService';
import type { WorkRateAbstractProps } from '../../DTOs/WorkRateAbstract'; 
import { toast } from 'sonner'; 
import  { WorkRateAbstractUrls } from '../../utils/urls';
import { parseApiError } from '@/shared/utils/parseApiError';

const useWorkRateAbstractList = () => { 
  const navigate = useNavigate();
  const workRateAbstractService = useWorkRateAbstractService();

  const [workRateAbstract, setWorkRateAbstract] = useState<WorkRateAbstractProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  const fetchWorkRateAbstract = async (searchString: string = '') => {
    setLoading(true);
    try {
      const workRateAbstractData = await workRateAbstractService.getWorkRateAbstracts(searchString);
      setWorkRateAbstract(workRateAbstractData);
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to fetch work rate abstracts'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkRateAbstract();
  }, []); 

 
  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await workRateAbstractService.deleteWorkRateAbstract(deleteId);
      toast.success('Work rate abstract deleted successfully');
      fetchWorkRateAbstract();
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to delete work rate abstract'));
    } finally {
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => setDeleteId(null);

  const handleEditworkRateAbstract = (id: number) => {
    navigate(WorkRateAbstractUrls.edit(id));
  };

  return {
    workRateAbstract,
    fetchWorkRateAbstract,
    confirmDelete,
    handleDelete,
    handleCancelDelete,
    deleteId, 
    handleEditworkRateAbstract,
    loading,
    searchText,
    setSearchText,
  };
};

export { useWorkRateAbstractList };