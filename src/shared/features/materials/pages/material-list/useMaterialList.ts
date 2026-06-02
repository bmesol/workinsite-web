import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaterialService } from '../../service/MaterialService';
import { toast } from 'sonner';

const useMaterialList = () => {
  const navigate = useNavigate();
  const materialService = useMaterialService();

  const [materialDetails, setMaterialDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchMaterial = async (searchString: string = '') => {
    setLoading(true);
    const materialData = await materialService.getMaterials(searchString);
    setMaterialDetails(materialData);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const handleMaterialSelect = (id: number) => {
    navigate(`/material/edit/${id}`);
  };

  const handleMaterialDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this Detail?');
    if (!confirmed) return;

    try {
      await materialService.deleteMaterial(id);
      fetchMaterial();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to delete Material';
      toast.error(errorMsg);
    }
  };

  return {
    materialDetails,
    fetchMaterial,
    handleMaterialSelect,
    handleMaterialDelete,
    loading,
    searchText,
    setSearchText,
  };
};

export { useMaterialList };