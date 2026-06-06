import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import type { Material } from '../../DTOs/MaterialProps';
import { ReceivedQualityTypes } from '../../DTOs/PurchaseProps';
import { usePurchaseMaterialInputValidate } from '../../components/InputValidate/PurchaseMaterialInputValidate';
import { useMaterialService } from '../../service/MaterialService';
import type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
} from '../../DTOs/PurchaseMaterialProps';


export type UploadedImage = {
  id?: number;
  uri: string;       // On web, this will be a base64 data URL or object URL
  name?: string;
  type?: string;
  file?: File;       // Web-only: keep original File reference for upload
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

interface PurchaseMaterialsEditFormProps {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<
    React.SetStateAction<PurchaseMaterialCreationListProps[]>
  >;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<
    React.SetStateAction<PurchaseMaterialUpdationListProps[]>
  >;
  selectedItem: {
    index: number;
    value:
      | PurchaseMaterialCreationListProps
      | PurchaseMaterialUpdationListProps;
  };
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<
    React.SetStateAction<number[]>
  >;
  closeModal: () => void;
}

// ─── Web image compression (replaces ImageResizer) ───────────────────────────
const compressImageToWebP = (file: File): Promise<{ uri: string; name: string; type: string; file: File }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_WIDTH = 1080;
      const MAX_HEIGHT = 1920;

      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (!blob) return reject(new Error('Compression failed'));
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, '.webp'),
            { type: 'image/webp' },
          );
          resolve({
            uri: URL.createObjectURL(compressedFile),
            name: compressedFile.name,
            type: 'image/webp',
            file: compressedFile,
          });
          URL.revokeObjectURL(objectUrl);
        },
        'image/webp',
        1.0,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image load error'));
    };

    img.src = objectUrl;
  });
};

// ─────────────────────────────────────────────────────────────────────────────

export const usePurchaseMaterialsEdit = ({
  newPurchaseMaterials,
  setNewPurchaseMaterials,
  updatedPurchaseMaterials = [],
  setUpdatedPurchaseMaterials = () => {},
  selectedItem,
  closeModal,
}: PurchaseMaterialsEditFormProps) => {
  const v = selectedItem.value;

  const [materialId, setMaterialId] = useState(v.material?.id.toString());
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [rate, setRate] = useState(v.rate);
  const [additionalCharges, setAdditionalCharges] = useState(v.additionalCharges);
  const [discount, setDiscount] = useState(v.discount);
  const [receivedDate, setReceivedDate] = useState(v.receivedDate);
  const [receivedQuantity, setReceivedQuantity] = useState(v.receivedQuantity);
 const [receivedQuality, setReceivedQuality] = useState<ReceivedQualityTypes>(
  (v.receivedQuality as ReceivedQualityTypes) ?? ReceivedQualityTypes.GOOD
);

  const [notes, setNotes] = useState(v.note);
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [showImage, setShowImage] = useState<ShowImage[]>([]);
  const [removedImages, setRemovedImages] = useState<RemovedImages[]>([]);

  // Web: replace RN bottom sheet ref with a simple boolean modal state
  const [isImageSheetOpen, setIsImageSheetOpen] = useState(false);

  // Web: hidden file input ref (replaces launchImageLibrary)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materialService = useMaterialService();

  const { error, validate, setError, initialError } =
    usePurchaseMaterialInputValidate({
        materialId,
    rate,
    receivedDate,
    receivedQuantity,
    receivedQuality,
    minQuantity,
    });

  const fetchMaterials = async (searchString: string = '') => {
    const materials = await materialService.getMaterials(searchString);
    if (!materials) return;
    setMaterialList(searchString ? materials.slice(0, 3) : materials);
  };

  const validateQuantity = (value: string, currentMin: number) => {
  const parsed = parseFloat(value);
  if (!value.trim() || isNaN(parsed) || parsed <= 0) {
    setError(prev => ({ ...prev, receivedQuantity: 'Received quantity is required' }));
  } else if (currentMin > 0 && parsed < currentMin) {
    setError(prev => ({ ...prev, receivedQuantity: `Value must be ${currentMin} or greater` }));
  } else {
    setError(prev => ({ ...prev, receivedQuantity: '' }));
  }
};


const handleReceivedQuantityChange = (value: string) => {
  setReceivedQuantity(value);
  validateQuantity(value, minQuantity);
};

  const materialDetails = materialList.map(item => ({
    label: `${item.name} [${item.unit.name}]`,
    value: item.id.toString(),
  }));

const ReceivedQualityItems = [
  { label: 'Good', value: ReceivedQualityTypes.GOOD },
  { label: 'Damaged', value: ReceivedQualityTypes.DAMAGED },
];

  useEffect(() => {
    if (!selectedItem || !v) return;

    setMaterialId(v.material?.id.toString());
    setRate(v.rate);
    setAdditionalCharges(v.additionalCharges);
    setDiscount(v.discount);
    setReceivedQuality((v.receivedQuality as ReceivedQualityTypes) ?? ReceivedQualityTypes.GOOD);
    setReceivedDate(v.receivedDate);
    setReceivedQuantity(v.receivedQuantity);
    setNotes(v.note !== null && v.note !== undefined ? v.note : '');

    const backendImages: ShowImage[] =
      'images' in v && Array.isArray(v.images)
        ? v.images.map(img => ({
            id: img.id,
            imagePath: img.imagePath,
            staticBaseUrl: img.staticBaseUrl,
          }))
        : [];

    const backendUploadedImages: UploadedImage[] =
      'images' in v && Array.isArray(v.images)
        ? v.images.map(img => ({
            uri: img.uri || '',
            name: img.name || 'image.webp',
            type: img.type || 'image/webp',
            id: img.id,
          }))
        : [];

    const newImgs: UploadedImage[] =
      'newImages' in v && Array.isArray(v.newImages)
        ? v.newImages.map(img => ({
            uri: img.uri,
            name: img.name,
            type: img.type,
          }))
        : [];

    setShowImage(backendImages);
    setUploadedImages([...backendUploadedImages, ...newImgs]);

    if (v.material && !materialList.some(m => m.id === v.material.id)) {
      setMaterialList(prev => [v.material, ...prev]);
    }
  }, [selectedItem]);

  // ─── Image sheet (replaces RN bottom sheet) ────────────────────────────────
  const handleImageSheetOpen = () => setIsImageSheetOpen(true);
  const handleImageSheetClose = () => setIsImageSheetOpen(false);

  // ─── File picker (replaces launchImageLibrary) ─────────────────────────────
  const handleImageUpload = () => {
    handleImageSheetClose();
    fileInputRef.current?.click(); // Programmatically open file picker
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      toast.info('No image selected.');
      return;
    }

    try {
      const compressed = await Promise.all(
        files.map(file => compressImageToWebP(file)),
      );
      setUploadedImages(prev => [...prev, ...compressed]);
    } catch (err) {
      toast.error('An error occurred while processing images.');
      console.error(err);
    }

    // Reset input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Payload helpers ───────────────────────────────────────────────────────
  const prepareImagesForPayload = (images: UploadedImage[]) => {
    return images.map(image => ({
      name: image.name || 'image.webp',
      type: image.type || 'image/webp',
      uri: image.uri,
      file: image.file,   // include File object for multipart/form-data uploads
    }));
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;

    const combinedList = [
      ...newPurchaseMaterials.map((x, i) => ({
        id: `new-${i}`,
        materialId: x.material.id,
      })),
      ...updatedPurchaseMaterials.map(x => ({
        id: `upd-${x.purchaseMaterialId}`,
        materialId: x.material.id,
      })),
    ];

    const currentId =
      'purchaseMaterialId' in selectedItem.value &&
      selectedItem.value.purchaseMaterialId
        ? `upd-${selectedItem.value.purchaseMaterialId}`
        : `new-${selectedItem.index}`;

    const isDuplicate = combinedList.some(
      item => item.materialId === Number(materialId) && item.id !== currentId,
    );

    if (isDuplicate) {
      setError(prev => ({
        ...prev,
        materialId: 'This material is already added in this purchase',
      }));
      return;
    }

    const commonData = {
      rate: rate.trim(),
      additionalCharges: additionalCharges.trim(),
      discount: discount.trim(),
      receivedQuality,
      receivedDate: receivedDate.trim(),
      receivedQuantity: receivedQuantity.trim(),
      note: notes?.trim(),
    };

    const existingItem = selectedItem.value;
    const isExisting =
      'purchaseMaterialId' in existingItem && existingItem.purchaseMaterialId;
    const selectedMaterial = materialList.find(
      m => m.id === parseInt(materialId),
    );

    if (isExisting) {
      const newImages = uploadedImages
        .filter(img => !img.id)
        .map(img => ({
          uri: img.uri,
          name: img.name || 'image.webp',
          type: img.type || 'image/webp',
          file: img.file,
        }));

      const updatedItem: PurchaseMaterialUpdationListProps = {
        ...existingItem,
        purchaseMaterialId: existingItem.purchaseMaterialId!,
        material: selectedMaterial!,
        ...commonData,
        newImages,
        removedImages,
      };

      const updatedList = [...updatedPurchaseMaterials];
      updatedList[selectedItem.index] = updatedItem;
      setUpdatedPurchaseMaterials?.(updatedList);
    } else {
      const images = prepareImagesForPayload(uploadedImages);
      const newItem: PurchaseMaterialCreationListProps = {
        material: selectedMaterial!,
        ...commonData,
        images,
      };

      const newList = [...newPurchaseMaterials];
      newList[selectedItem.index] = newItem;
      setNewPurchaseMaterials(newList);
    }

    setError(initialError);
    closeModal();
  };

  return {
    materialId,
    setMaterialId,
    handleReceivedQuantityChange,  
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
    handleFileChange,     // Web: attach to hidden <input type="file" />
    fileInputRef,         // Web: ref for hidden file input
    isImageSheetOpen,     // Web: replaces imageSheetRef bottom sheet
    handleImageSheetOpen,
    handleImageSheetClose,
    handleSubmit,
    error,
    showImage,
    setShowImage,
    removedImages,
    setRemovedImages,
  };
};