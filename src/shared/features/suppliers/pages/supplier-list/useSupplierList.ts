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

  const fetchSupplier = async (searchString: string = "") => {
    const supplierData = await supplierService.getSuppliers(searchString);
    if (searchString) setHasSearchFilter(true); // 👈 removed !! (unnecessary)
    else setHasSearchFilter(false);              // 👈 reset filter when search cleared
    setSupplierDetails(supplierData);
  };

  useEffect(() => { fetchSupplier(); }, []);

  const handleSupplierSelect = (id: number) => navigate(SuppliersUrls.edit(id));

  const handleSupplierDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await supplierService.deleteSupplier(id);
    fetchSupplier();  // 👈 avoid full page reload, re-fetch instead
  };

  return { supplierDetails, fetchSupplier, handleSupplierSelect, handleSupplierDelete, hasSearchFilter };
};

export { useSupplierList };