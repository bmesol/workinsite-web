import { useState } from 'react';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import { useMaterialService } from '../../service/MaterialService';
import { ReceivedQualityTypes } from '../../DTOs/PurchaseProps';
import { usePurchaseMaterialInputValidate } from '../../components/InputValidate/PurchaseMaterialInputValidate';
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../../DTOs/PurchaseMaterialProps';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';

export type UploadedImage = {
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

interface UsePurchaseMaterialsCreationProps {
  purchaseMaterials: PurchaseMaterialCreationListProps[];
  setPurchaseMaterials: (value: PurchaseMaterialCreationListProps[]) => void;
  onClose?: () => void;
  addPurchaseMaterial: (item: PurchaseMaterialCreationListProps) => void;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
}

export const usePurchaseMaterialsCreation = ({
  purchaseMaterials,
  setPurchaseMaterials,
  updatedPurchaseMaterials = [],
  onClose,
}: UsePurchaseMaterialsCreationProps) => {
  const materialService = useMaterialService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [materialId, setMaterialId] = useState('');
  const [rate, setRate] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [receivedQuality, setReceivedQuality] = useState<ReceivedQualityTypes | ''>('');
  const [receivedDate, setReceivedDate] = useState(formatted);
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const { error, validate, setError, initialError } = 
  usePurchaseMaterialInputValidate({
  materialId,
  rate,
  receivedQuality,
  receivedDate,
  receivedQuantity,
    });

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit?.name}]`,
    value: item.id.toString(),
  }));

  const fetchMaterials = async (searchString: string = '') => {
    const materials = await materialService.getMaterials(searchString);
    if (!materials) return;
    setMaterialList(searchString ? materials.slice(0, 3) : materials);
  };

  const ReceivedQualityItems = [
    { label: ReceivedQualityTypes.GOOD, value: ReceivedQualityTypes.GOOD },
    { label: ReceivedQualityTypes.DAMAGED, value: ReceivedQualityTypes.DAMAGED },
  ];

const resetFields = () => {
  setMaterialId('');
  setRate('');
  setAdditionalCharges('');
  setDiscount('');
  setReceivedQuality('');
  setReceivedDate(formatted);
  setReceivedQuantity('');
  setNotes('');
  setUploadedImages([]);
  setError(initialError);
};
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

  const handleAddPurchaseItem = () => {
    if (!validate()) return;

    const isDuplicate = purchaseMaterials.some(
      item => String(item?.material.id) === String(materialId),
    );
    const isDuplicateUpdated = updatedPurchaseMaterials.some(
      item => String(item?.material.id) === String(materialId),
    );

    if (isDuplicate || isDuplicateUpdated) {
      setError(prev => ({
        ...prev,
        materialId: 'This material is already added in this purchase',
      }));
      return;
    }

    const selectedMaterial = materialList.find(
      m => m.id === parseInt(materialId),
    );

   const newItem: PurchaseMaterialCreationListProps = {
  material: selectedMaterial!,
  rate: rate.trim(),
  additionalCharges: additionalCharges.trim(),
  discount: discount.trim(),
  receivedQuality: receivedQuality as ReceivedQualityTypes,
  receivedDate: receivedDate.trim(),
  receivedQuantity: receivedQuantity.trim(),
  note: notes.trim(),
  images: uploadedImages,
};
    setPurchaseMaterials([...purchaseMaterials, newItem]);
    resetFields();
    onClose?.();
  };

  return {
    materialId,
    setMaterialId,
    rate,
    setRate,
    additionalCharges,
    setAdditionalCharges,
    discount,
    setDiscount,
    receivedQuality,
    setReceivedQuality,
    receivedDate,
    setReceivedDate,
    receivedQuantity,
    setReceivedQuantity,
    notes,
    setNotes,
    materialList,
    materialDetails,
    fetchMaterials,
    ReceivedQualityItems,
    uploadedImages,
    setUploadedImages,
    handleImageUpload,

    handleAddPurchaseItem,
    error,
  };
};