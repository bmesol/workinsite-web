import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import type { ReceivedQualityTypes, UploadedImage, RemovedImage, PurchaseViewImage } from './PurchaseProps';

interface PurchaseMaterialCreationListProps {
  material: Material;
  rate: string;
  additionalCharges: string;
  discount: string;
  receivedQuality: ReceivedQualityTypes;
  receivedDate: string;
  receivedQuantity: string;
  note?: string;
  images?: UploadedImage[];
}

interface PurchaseMaterialUpdationListProps {
  purchaseMaterialId: number;
  material: Material;
  quantity: string;
  rate: string;
  additionalCharges: string;
  discount: string;
  receivedQuality: ReceivedQualityTypes;
  receivedDate: string;
  receivedQuantity: string;
  note?: string;
  newImages?: UploadedImage[];
  removedImages?: RemovedImage[];
  images?: PurchaseViewImage[];
}

export type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
};