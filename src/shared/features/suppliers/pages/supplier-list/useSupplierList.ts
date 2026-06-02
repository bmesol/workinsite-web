import { useSupplierService } from "../../service/SupplierService";
import type { Supplier } from "../../DTOs/SupplierProps";
import { SuppliersUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useSupplierList = () => {
  const navigate = useNavigate();
  const supplierService = useSupplierService();
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);            
  const [searchLoading, setSearchLoading] = useState(false); 
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const supplierData = await supplierService.getSuppliers("");
        setSupplierDetails(supplierData);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const fetchSupplier = async (searchString: string = "") => {
    setSearchLoading(true);
    try {
      const supplierData = await supplierService.getSuppliers(searchString);
      setHasSearchFilter(searchString !== "");
      setSupplierDetails(supplierData);
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshList = async () => {
    const supplierData = await supplierService.getSuppliers("");
    setSupplierDetails(supplierData);
  };

  const handleSupplierSelect = (id: number) => navigate(SuppliersUrls.edit(id));

  const confirmDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleSupplierDelete = async (id: number) => {
    await supplierService.deleteSupplier(id);
    setDeleteId(null);
    refreshList(); 
  };

  return {
    supplierDetails,
    fetchSupplier,
    handleSupplierSelect,
    confirmDelete,
    handleSupplierDelete,
    hasSearchFilter,
    loading,
    searchLoading,
    deleteId,
    setDeleteId,
  };
};

export { useSupplierList };