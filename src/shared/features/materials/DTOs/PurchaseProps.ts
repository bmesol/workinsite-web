import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import type  { Material } from '@/shared/features/materials/DTOs/MaterialProps';

type UploadedImage = {
  id?: number;
  uri: string;
  name?: string;
  type?: string;
  file?: File;
};

type RemovedImage = {
  id: number;
  imagePath: string;
};

type PurchaseViewImage = {
  id: number;
  imagePath: string;
  staticBaseUrl: string;
  uri?: string;
  name?: string;
  type?: string;
};

export const ReceivedQualityTypes = {
  GOOD: 'Good',
  DAMAGED: 'Damaged',
} as const;

export type ReceivedQualityTypes = typeof ReceivedQualityTypes[keyof typeof ReceivedQualityTypes];

interface PurchaseMaterial {
  id: number;
  material: Material;
  images?: PurchaseViewImage[];
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
  images?: UploadedImage[];
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
  newImages?: UploadedImage[];
  removedImages?: RemovedImage[];
}

interface Purchase {
  id: number;
  billNumber: string;
  site: Site;
  supplier: Supplier;
  date: string;
  purchaseMaterials: PurchaseMaterial[];
  images?: PurchaseViewImage[];
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
  Images?: UploadedImage[];
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
  RemovedImages?: RemovedImage[];
  Images?: UploadedImage[];
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

interface PurchasePagedResult {
  items: Purchase[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export type {
  Purchase,
  PurchasePagedResult,
  PurchaseCreationRequest,
  PurchaseUpdationRequest,
  PurchaseMaterial,
  PurchaseMaterialCreation,
  PurchaseMaterialUpdation,
  PurchaseFilterRequest,
  UploadedImage,
  RemovedImage,
  PurchaseViewImage,
};