import { useEffect, useState } from "react";
import { useMaterialService } from "../../service/MaterialService";
import { useNavigate } from "react-router-dom";
// or your toast lib

const useMaterialList = () => {
  const materialService = useMaterialService();
  const navigate = useNavigate();
  const [materialDetails, setMaterialDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchMaterial();
  }, []);

  const fetchMaterial = async (searchString: string = "") => {
    setLoading(true);
    try {
      const materialData = await materialService.getMaterials(searchString);
      setMaterialDetails(materialData);
    } finally {
      setLoading(false);
    }
  };

  // const handleMaterialSelect = (id: number) => {
  //   navigate(`/material/edit/${id}`);
  // };

  const handleMaterialSelect = (id: number) => {
  navigate(`/materials/${id}/edit`);
};

  // ✅ OPEN DIALOG
  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  // ✅ ACTUAL DELETE
  const handleMaterialDelete = async (id: number) => {
    try {
      await materialService.deleteMaterial(id);
      setDeleteId(null);
      fetchMaterial(searchText);
    } catch (error: any) {
      
    }
  };

  return {
    materialDetails,
    fetchMaterial,
    handleMaterialSelect,
    handleMaterialDelete,
    confirmDelete,
    loading,
    searchText,
    setSearchText,
    deleteId,
    setDeleteId,
  };
};

export { useMaterialList };