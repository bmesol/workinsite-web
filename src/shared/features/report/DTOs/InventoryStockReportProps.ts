export interface InventoryUnit {
  name: string;
  note?: string;
  isActive?: boolean;
  id?: number;
}

export interface InventoryMaterial {
  id: number;
  name: string;
  hsnCode?: string;
  unit: InventoryUnit;
}

export interface PurchaseDetail {
  date: string;
  quantity: string;
}

export interface UsedDetail {
  date: string;
  quantity: string;
}

export interface TransferDetail {
  date: string;
  quantity: string;
  siteId: number;
  siteName: string;
}

export interface InventoryMaterialRow {
  sNo: number;
  material: InventoryMaterial;
  purchaseQuantity: string;
  purchaseDetails: PurchaseDetail[];
  usedQuantity: string;
  usedDetails: UsedDetail[];
  transferInQuantity: string;
  transferInDetails: TransferDetail[];
  transferOutQuantity: string;
  transferOutDetails: TransferDetail[];
  availableStock: string;
}

export interface InventorySite {
  id: number;
  name: string;
}

export interface InventoryReportItem {
  site: InventorySite;
  materials: InventoryMaterialRow[];
}

export interface InventoryStockReportResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: InventoryReportItem[];
}
