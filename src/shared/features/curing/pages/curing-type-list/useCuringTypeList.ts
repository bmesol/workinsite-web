import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringTypeService } from '../../service/CuringTypeService';
import type { CuringType } from '../../DTOs/CuringTypeProps';
import { CuringTypeUrls } from '../../utils/urls';

const useCuringTypeList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curingTypeService = useCuringTypeService();

  const [curingTypeList, setCuringTypeList] = useState<CuringType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCuringTypes();
  }, [location.state?.refresh]);

  const fetchCuringTypes = async () => {
    try {
      const data = await curingTypeService.getCuringTypes();
      setCuringTypeList(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch curing types.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleCuringTypeDelete = async (id: number) => {
    try {
      await curingTypeService.deleteCuringType(id);
      setDeleteId(null);
      fetchCuringTypes();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete curing type.',
      );
    }
  };

  const handleEditCuringType = (id: number) =>
    navigate(CuringTypeUrls.edit(id));

  return {
    curingTypeList,
    loading,
    searchText,
    setSearchText,
    fetchCuringTypes,
    confirmDelete,
    deleteId,
    setDeleteId,
    handleCuringTypeDelete,
    handleEditCuringType,
  };
};

export { useCuringTypeList };