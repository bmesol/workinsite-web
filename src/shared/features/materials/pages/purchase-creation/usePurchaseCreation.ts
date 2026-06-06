import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePurchaseInputValidate } from '../../components/InputValidate/PurchaseInputValidate';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import { useMaterialPurchaseService } from '../../service/PurchaseService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import type { PurchaseMaterialCreationListProps } from '../../DTOs/PurchaseMaterialProps';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

export const usePurchaseCreation = () => {
  const navigate = useNavigate();
  const siteService = useSiteService();
  const supplierService = useSupplierService();
  const purchaseService = useMaterialPurchaseService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [billNumber, setBillNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState<string>(formatted);
  const [totalAmount, setTotalAmount] = useState('');
  const [gst, setGst] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [purchaseMaterials, setPurchaseMaterials] = useState<PurchaseMaterialCreationListProps[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageSheetOpen, setImageSheetOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const { error, validate, setError, initialError } = usePurchaseInputValidate({
    billNumber,
    supplierId,
    siteId,
    date,
    totalAmount,
    gst,
  });

  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const fetchSuppliers = async (searchString: string = '') => {
    const suppliers = await supplierService.getSuppliers(searchString);
    if (!suppliers) return;
    setSupplierList(searchString ? suppliers.slice(0, 3) : suppliers);
  };

  const supplierDetails = supplierList.map(supplier => ({
    label: supplier.name,
    value: supplier.id.toString(),
  }));

  const resetFormFields = () => {
    setBillNumber('');
    setSupplierId('');
    setSiteId('');
    setDate(formatted);
    setTotalAmount('');
    setGst('');
    setAdditionalCharges('');
    setDiscount('');
    setNotes('');
    setError(initialError);
    setPurchaseMaterials([]);
    setUploadedImages([]);
  };

  const hasUnsavedChanges = () => {
    return (
      billNumber !== '' ||
      supplierId !== '' ||
      siteId !== '' ||
      date !== formatted ||
      totalAmount !== '' ||
      gst !== '' ||
      additionalCharges !== '' ||
      discount !== '' ||
      notes !== '' ||
      uploadedImages.length > 0 ||
      purchaseMaterials.length > 0
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      return true; // UI layer shows AlertDialog
    }
    resetFormFields();
    navigate('/materials/purchase');
    return false;
  };

  const handleConfirmExit = () => {
    resetFormFields();
    navigate('/materials/purchase');
  };

  const handleSaveAndExit = async () => {
    await handleSubmission(true);
  };

  const addPurchaseMaterial = (item: PurchaseMaterialCreationListProps) => {
    const updatedItems = [...purchaseMaterials, item];
    setPurchaseMaterials(updatedItems);
    updateTotals(updatedItems);
  };

  const removePurchaseMaterial = (index: number) => {
    const updatedItems = purchaseMaterials.filter(
      item => item.material.id !== index,
    );
    setPurchaseMaterials(updatedItems);
    updateTotals(updatedItems);
  };

  const updateTotals = (materials: any[]) => {
    if (materials.length === 0) {
      setTotalAmount('');
      setAdditionalCharges('');
      setDiscount('');
      return;
    }

    const baseTotal = materials.reduce(
      (sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0),
      0,
    );

    const totalAdditionalCharges = materials.reduce(
      (sum, item) => sum + (parseFloat(item.additionalCharges) || 0),
      0,
    );

    const totalDiscounts = materials.reduce(
      (sum, item) => sum + (parseFloat(item.discount) || 0),
      0,
    );

    const finalTotal = baseTotal + totalAdditionalCharges - totalDiscounts;

    setTotalAmount(finalTotal.toFixed(2));
    setAdditionalCharges(totalAdditionalCharges.toFixed(2));
    setDiscount(totalDiscounts.toFixed(2));
  };

  useEffect(() => {
    updateTotals(purchaseMaterials);
  }, [purchaseMaterials]);

  // Web image upload using file input
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      uri: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      file,
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleSubmission = async (redirectAfter = true) => {
    if (!validate()) return;

    try {
      const parsedSupplierId = parseInt(supplierId);
      const parsedSiteId = parseInt(siteId);

      const form = new FormData();
      form.append('BillNumber', billNumber.trim());
      form.append('SiteId', parsedSiteId.toString());
      form.append('SupplierId', parsedSupplierId.toString());
      form.append('Date', date.trim());

      purchaseMaterials.forEach((item, index) => {
        form.append(`PurchaseMaterials[${index}].materialId`, String(item.material.id));
        form.append(`PurchaseMaterials[${index}].rate`, item.rate);
        form.append(`PurchaseMaterials[${index}].additionalCharges`, item.additionalCharges);
        form.append(`PurchaseMaterials[${index}].discount`, item.discount);
        form.append(`PurchaseMaterials[${index}].receivedQuality`, item.receivedQuality);
        form.append(`PurchaseMaterials[${index}].receivedDate`, item.receivedDate);
        form.append(`PurchaseMaterials[${index}].receivedQuantity`, item.receivedQuantity);
        form.append(`PurchaseMaterials[${index}].note`, item.note || '');
        item.images?.forEach((img: any) => {
          if (img.file) form.append(`PurchaseMaterials[${index}].images`, img.file);
        });
      });

      form.append('TotalAmount', parseFloat(totalAmount).toFixed(2));
      form.append('GST', gst.trim());
      form.append('AdditionalCharges', parseFloat(additionalCharges).toFixed(2));
      form.append('Discount', parseFloat(discount).toFixed(2));
      form.append('Note', notes.trim());

      uploadedImages.forEach(img => {
        if (img.file) form.append('Images', img.file);
      });

      await purchaseService.createMaterialPurchase(form);

      if (redirectAfter) {
        resetFormFields();
        navigate('/materials/purchase', { state: { refresh: true } });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create Purchase');
    }
  };

  return {
    billNumber,
    setBillNumber,
    supplierId,
    setSupplierId,
    siteId,
    setSiteId,
    date,
    setDate,
    totalAmount,
    setTotalAmount,
    gst,
    setGst,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    notes,
    setNotes,
    supplierDetails,
    siteDetails,
    fetchSites,
    fetchSuppliers,
    error,
    handleSubmission,
    handleBackPress,
    handleConfirmExit,
    handleSaveAndExit,
    purchaseMaterials,
    setPurchaseMaterials,
    addPurchaseMaterial,
    removePurchaseMaterial,
    updateTotals,
    hasUnsavedChanges,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,
    imageSheetOpen,
    setImageSheetOpen,
    showExitDialog,
    setShowExitDialog,
  };
};