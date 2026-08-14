import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterialPurchaseService } from '../../service/PurchaseService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import { usePurchaseInputValidate } from '../../components/InputValidate/PurchaseInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import type { Purchase } from '../../DTOs/PurchaseProps';
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../../DTOs/PurchaseMaterialProps';
import { PurchaseUrls } from '../../utils/urls';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

type ShowImage = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
};

type RemovedImages = {
  id: number;
  imagePath: string;
};

export const usePurchaseEdit = (id: string) => {
  const navigate = useNavigate();
  const purchaseService = useMaterialPurchaseService();
  const supplierService = useSupplierService();
  const siteService = useSiteService();

  const [billNumber, setBillNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [gst, setGst] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPurchaseMaterials, setNewPurchaseMaterials] = useState <
    PurchaseMaterialCreationListProps[]
  >([]);
  const [updatedPurchaseMaterials, setUpdatedPurchaseMaterials] = useState <
    PurchaseMaterialUpdationListProps[]
  >([]);
  const [removedPurchaseMaterialIds, setRemovedPurchaseMaterialIds] = useState <
    number[]
  >([]);
  const [purchaseDetails, setPurchaseDetails] = useState<Purchase>();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImage, setShowImage] = useState<ShowImage[]>([]);
  const [removedImages, setRemovedImages] = useState<RemovedImages[]>([]);

  const { error, validate, setError, initialError } = usePurchaseInputValidate({
    billNumber,
    supplierId,
    siteId,
    date,
    totalAmount,
    gst,
  });

  // ── Fetch Purchase ──
  const fetchPurchase = async () => {
    setLoading(true);
    try {
      const purchaseData = await purchaseService.getMaterialPurchase(parseInt(id));
      setPurchaseDetails(purchaseData);
      setDate(purchaseData.date);
      setBillNumber(purchaseData.billNumber);
      setSupplierId(purchaseData.supplier.id.toString());
      setSupplierList([purchaseData.supplier]);
      setSiteId(purchaseData.site.id.toString());
      setSiteList([purchaseData.site]);
      setTotalAmount(purchaseData.totalAmount.toString());
      setGst(purchaseData.gst.toString());
      setAdditionalCharges(purchaseData.additionalCharges?.toString() ?? '');
      setDiscount(purchaseData.discount?.toString() ?? '');
      setNotes(purchaseData.note ?? '');
      setShowImage(purchaseData.images ?? []);

      const mappedUpdatedMaterials: PurchaseMaterialUpdationListProps[] =
  purchaseData.purchaseMaterials.map((pm: any) => ({
    purchaseMaterialId: pm.id,
    materialId: pm.material?.id,
    material: pm.material,
    quantity: pm.quantity?.toString() ?? '',
    rate: pm.rate?.toString() ?? '',
    additionalCharges: pm.additionalCharges?.toString() ?? '',
    discount: pm.discount?.toString() ?? '',
    receivedQuality: pm.receivedQuality,
    receivedDate: pm.receivedDate,
    receivedQuantity: pm.receivedQuantity?.toString() ?? '',
    note: pm.note,
    images: pm.images,
  }));

      setUpdatedPurchaseMaterials(mappedUpdatedMaterials);
    } catch (error) {
      toast.error('Failed to fetch purchase data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [id]);

  // ── Fetch Sites ──
  const fetchSites = async (searchString: string = '') => {
    let source = allSites;
    if (!source.length) {
      const sites = await siteService.getSites({ status: 'Working' });
      if (!sites) return;
      setAllSites(sites);
      source = sites;
    }
    const lower = searchString.toLowerCase();
    setSiteList(
      searchString ? source.filter(s => s.name.toLowerCase().includes(lower)) : source,
    );
  };

  // ── Fetch Suppliers ──
  const fetchSuppliers = async (searchString: string = '') => {
    const suppliers = await supplierService.getSuppliers(searchString);
    if (!suppliers) return;
    setSupplierList(searchString ? suppliers.slice(0, 3) : suppliers);
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // ── Add Purchase Material ──
  const addPurchaseMaterial = (item: PurchaseMaterialCreationListProps) => {
    const updatedItems = [...newPurchaseMaterials, item];
    setNewPurchaseMaterials(updatedItems);
    updateTotals(updatedItems, updatedPurchaseMaterials);
  };

  // ── Update Totals ──
  const updateTotals = (
    newMaterials: any[] = [],
    updatedMaterials: any[] = [],
  ) => {
    const allMaterials = [...newMaterials, ...updatedMaterials];

    if (allMaterials.length === 0) {
      setTotalAmount('0.00');
      setAdditionalCharges('0.00');
      setDiscount('0.00');
      return;
    }

    const baseTotal = allMaterials.reduce(
      (sum, item) =>
        sum + (parseFloat(item.receivedQuantity) || 0) * (parseFloat(item.rate) || 0),
      0,
    );

    const totalAdditionalCharges = allMaterials.reduce(
      (sum, item) => sum + (parseFloat(item.additionalCharges) || 0),
      0,
    );

    const totalDiscounts = allMaterials.reduce(
      (sum, item) => sum + (parseFloat(item.discount) || 0),
      0,
    );

    const finalTotal = baseTotal + totalAdditionalCharges - totalDiscounts;

    setTotalAmount(finalTotal.toFixed(2));
    setAdditionalCharges(totalAdditionalCharges.toFixed(2));
    setDiscount(totalDiscounts.toFixed(2));
  };

  useEffect(() => {
    updateTotals(newPurchaseMaterials, updatedPurchaseMaterials);
  }, [newPurchaseMaterials, updatedPurchaseMaterials]);

  // ── Reset Form ──
  const resetFormFields = () => {
    setUploadedImages([]);
    setShowImage([]);
    setRemovedImages([]);
    setNewPurchaseMaterials([]);
    setAllSites([]);
    setError(initialError);
  };

  // ── Image Upload (web) ──
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

  // ── Has Unsaved Changes ──
  const hasUnsavedChanges = useCallback(() => {
    const materialsChanged =
      JSON.stringify(updatedPurchaseMaterials) !==
      JSON.stringify(purchaseDetails?.purchaseMaterials ?? []);

    const imagesChanged =
      uploadedImages.length > 0 ||
      removedImages.length > 0;

    return (
      billNumber !== purchaseDetails?.billNumber ||
      supplierId !== purchaseDetails?.supplier.id.toString() ||
      siteId !== purchaseDetails?.site.id.toString() ||
      date !== purchaseDetails?.date?.toString() ||
      totalAmount !== purchaseDetails?.totalAmount?.toString() ||
      gst !== purchaseDetails?.gst?.toString() ||
      additionalCharges !== purchaseDetails?.additionalCharges?.toString() ||
      discount !== purchaseDetails?.discount?.toString() ||
      notes !== purchaseDetails?.note ||
      newPurchaseMaterials.length > 0 ||
      removedPurchaseMaterialIds.length > 0 ||
      materialsChanged ||
      imagesChanged
    );
  }, [
    billNumber, supplierId, siteId, date, totalAmount, gst,
    additionalCharges, discount, notes, newPurchaseMaterials,
    updatedPurchaseMaterials, removedPurchaseMaterialIds,
    uploadedImages, removedImages, purchaseDetails,
  ]);

  // ── Submit ──
  const handleSubmission = async () => {
    if (!validate()) return;

    try {
      const form = new FormData();
      form.append('BillNumber', billNumber.trim());
      form.append('SiteId', siteId);
      form.append('SupplierId', supplierId);
      form.append('Date', date.trim());

      (newPurchaseMaterials || []).forEach((item, index) => {
        form.append(`NewPurchaseMaterials[${index}].materialId`, String(item.material.id));
        form.append(`NewPurchaseMaterials[${index}].rate`, item.rate);
        form.append(`NewPurchaseMaterials[${index}].additionalCharges`, item.additionalCharges);
        form.append(`NewPurchaseMaterials[${index}].discount`, item.discount);
        form.append(`NewPurchaseMaterials[${index}].receivedQuality`, item.receivedQuality);
        form.append(`NewPurchaseMaterials[${index}].receivedDate`, item.receivedDate);
        form.append(`NewPurchaseMaterials[${index}].receivedQuantity`, item.receivedQuantity);
        form.append(`NewPurchaseMaterials[${index}].note`, item.note ?? '');
        item.images?.forEach((img: any) => {
          if (img.file) form.append(`NewPurchaseMaterials[${index}].images`, img.file);
        });
      });

      (updatedPurchaseMaterials || []).forEach((item, index) => {
        form.append(`UpdatedPurchaseMaterials[${index}].purchaseMaterialId`, String(item.purchaseMaterialId));
        form.append(`UpdatedPurchaseMaterials[${index}].materialId`, String(item.material.id));
        form.append(`UpdatedPurchaseMaterials[${index}].quantity`, item.quantity);
        form.append(`UpdatedPurchaseMaterials[${index}].rate`, item.rate);
        form.append(`UpdatedPurchaseMaterials[${index}].additionalCharges`, item.additionalCharges);
        form.append(`UpdatedPurchaseMaterials[${index}].discount`, item.discount);
        form.append(`UpdatedPurchaseMaterials[${index}].receivedQuality`, item.receivedQuality);
        form.append(`UpdatedPurchaseMaterials[${index}].receivedDate`, item.receivedDate);
        form.append(`UpdatedPurchaseMaterials[${index}].receivedQuantity`, item.receivedQuantity);
        form.append(`UpdatedPurchaseMaterials[${index}].note`, item.note ?? '');
        item.newImages?.forEach((img: any) => {
          if (img.file) form.append(`UpdatedPurchaseMaterials[${index}].newImages`, img.file);
        });
        item.removedImages?.forEach((image: any, imgIndex: number) => {
          form.append(`UpdatedPurchaseMaterials[${index}].RemovedImages[${imgIndex}].id`, String(image.id));
          form.append(`UpdatedPurchaseMaterials[${index}].RemovedImages[${imgIndex}].imagePath`, image.imagePath);
        });
      });

      removedPurchaseMaterialIds.forEach((id, index) => {
        form.append(`RemovedPurchaseMaterialIds[${index}]`, id.toString());
      });

      form.append('TotalAmount', parseFloat(totalAmount).toFixed(2));
      form.append('GST', gst.trim());
      form.append('AdditionalCharges', parseFloat(additionalCharges).toFixed(2));
      form.append('Discount', parseFloat(discount).toFixed(2));
      if (notes) form.append('Note', notes.trim());

      uploadedImages.forEach((img) => {
        if (img.file) form.append('Images', img.file);
      });

      removedImages.forEach((image, index) => {
        form.append(`RemovedImages[${index}].id`, String(image.id));
        form.append(`RemovedImages[${index}].imagePath`, image.imagePath);
      });

      await purchaseService.updateMaterialPurchase(parseInt(id), form);
      toast.success('Purchase updated successfully.');
      resetFormFields();
      navigate(PurchaseUrls.list);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to edit Purchase.');
    }
  };

  return {
    billNumber, setBillNumber,
    supplierId, setSupplierId,
    siteId, setSiteId,
    date, setDate,
    totalAmount, setTotalAmount,
    gst, setGst,
    additionalCharges, setAdditionalCharges,
    discount, setDiscount,
    notes, setNotes,
    siteDetails,
    supplierDetails,
    fetchSites,
    fetchSuppliers,
    purchaseDetails,
    error,
    loading,
    handleSubmission,
    hasUnsavedChanges,
    addPurchaseMaterial,
    newPurchaseMaterials, setNewPurchaseMaterials,
    updatedPurchaseMaterials, setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds, setRemovedPurchaseMaterialIds,
    uploadedImages, setUploadedImages,
    handleImageUpload,
    showImage, setShowImage,
    removedImages, setRemovedImages,
  };
};