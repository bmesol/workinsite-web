import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import type { ReceivedQualityTypes } from './PurchaseProps';

interface PurchaseMaterialCreationListProps {
  material: Material;
  rate: string;
  additionalCharges: string;
  discount: string;
  receivedQuality: ReceivedQualityTypes;
  receivedDate: string;
  receivedQuantity: string;
  note?: string;
  images?: any;
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
  newImages?: any;
  removedImages?: any;
}

export type {
  PurchaseMaterialCreationListProps,
  PurchaseMaterialUpdationListProps,
};