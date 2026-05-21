import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useWorkRateAbstractService } from '../../service/WorkRateAbstractService';
import type { WorkRateAbstractProps } from '../../DTOs/WorkRateAbstract'; 
import { toast } from 'sonner'; 
import  { WorkRateAbstractUrls } from '../../utils/urls'; 

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
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to fetch work rate abstracts';
      toast.error(errorMsg);
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
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to delete work rate abstract';
      toast.error(errorMsg);
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