import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import type  { Material } from '@/shared/features/materials/DTOs/MaterialProps';

export const ReceivedQualityTypes = {
  GOOD: 'Good',
  DAMAGED: 'Damaged',
} as const;

export type ReceivedQualityTypes = typeof ReceivedQualityTypes[keyof typeof ReceivedQualityTypes];

interface PurchaseMaterial {
  id: number;
  material: Material;
  images?: any;
  quantity: string;
  rate: string;
  additionalCharges: string;
  discount: string;
  receivedQuality: ReceivedQualityTypes;
  receivedDate: string;
  receivedQuantity: string;
  note?: string;
}

interface PurchaseMaterialCreation {
  materialId: number;
  material?: Material;
  quantity: string;
  rate: string;
  additionalCharges: string;
  discount: string;
  receivedQuality: ReceivedQualityTypes;
  receivedDate: string;
  receivedQuantity: string;
  note?: string;
  images?: any;
}

interface PurchaseMaterialUpdation {
  purchaseMaterialId: number;
  materialId: number;
  material?: Material;
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

interface Purchase {
  id: number;
  billNumber: string;
  site: Site;
  supplier: Supplier;
  date: string;
  purchaseMaterials: PurchaseMaterial[];
  images?: any;
  totalAmount: string;
  gst: string;
  additionalCharges: string;
  discount: string;
  note?: string;
}

interface PurchaseCreationRequest {
  BillNumber: string;
  SiteId: number;
  SupplierId: number;
  Date: string;
  PurchaseMaterials: PurchaseMaterialCreation[];
  Images?: any;
  TotalAmount: string;
  GST: string;
  AdditionalCharges: string;
  Discount: string;
  Note?: string;
}

interface PurchaseUpdationRequest {
  BillNumber: string;
  SiteId: number;
  SupplierId: number;
  Date: string;
  NewPurchaseMaterials?: PurchaseMaterialCreation[];
  UpdatedPurchaseMaterials?: PurchaseMaterialUpdation[];
  RemovedPurchaseMaterialIds?: number[];
  RemovedImages?: any;
  Images?: any;
  TotalAmount: string;
  GST: string;
  AdditionalCharges: string;
  Discount: string;
  Note?: string;
}

interface PurchaseFilterRequest {
  BillNumber?: string;
  SiteId?: number;
  SupplierId?: number;
  Date?: string;
  PageNumber?: number;
  PageSize?: number;
}

export type {
  Purchase,
  PurchaseCreationRequest,
  PurchaseUpdationRequest,
  PurchaseMaterial,
  PurchaseMaterialCreation,
  PurchaseMaterialUpdation,
  PurchaseFilterRequest,
};