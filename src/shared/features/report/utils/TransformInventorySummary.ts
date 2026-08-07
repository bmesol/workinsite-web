import type {
  InventoryReportItem,
  PurchaseDetail,
  UsedDetail,
  TransferDetail,
} from '../DTOs/InventoryStockReportProps'


export interface MaterialSiteBreakdown {
  siteId: number;
  siteName: string;
  purchaseQuantity: string;
  purchaseDetails: PurchaseDetail[];
  usedQuantity: string;
  usedDetails: UsedDetail[];
  transferInQuantity: string;
  transferInDetails: TransferDetail[];
  transferOutQuantity: string;
  transferOutDetails: TransferDetail[];
  availableStock: string; // closing stock at this site for the period
}

/** One row of the material-wise summary table (aggregated across all sites). */
export interface MaterialSummary {
  materialId: number;
  materialName: string;
  unit: string;
  totalPurchased: number;
  totalUsed: number;
  totalTransferIn: number;
  totalTransferOut: number;
  totalAvailable: number;
  activeSites: number;
  sites: MaterialSiteBreakdown[];
}

/** Parse a quantity string ("268", "1500.5", "") into a safe number. */
export const toNum = (v?: string | number): number => {
  const n = typeof v === 'number' ? v : parseFloat(v ?? '');
  return Number.isFinite(n) ? n : 0;
};

export function buildMaterialSummary(
  items: InventoryReportItem[],
): MaterialSummary[] {
  const byMaterial = new Map<number, MaterialSummary>();

  for (const item of items ?? []) {
    if (!item?.site) continue;
    const { id: siteId, name: siteName } = item.site;

    for (const row of item.materials ?? []) {
      if (!row?.material) continue;
      const key = row.material.id;
      if (key == null) continue;

      if (!byMaterial.has(key)) {
        byMaterial.set(key, {
          materialId: key,
          materialName: row.material.name,
          unit: row.material.unit?.name ?? '',
          totalPurchased: 0,
          totalUsed: 0,
          totalTransferIn: 0,
          totalTransferOut: 0,
          totalAvailable: 0,
          activeSites: 0,
          sites: [],
        });
      }

      const m = byMaterial.get(key)!;
      m.totalPurchased += toNum(row.purchaseQuantity);
      m.totalUsed += toNum(row.usedQuantity);
      m.totalTransferIn += toNum(row.transferInQuantity);
      m.totalTransferOut += toNum(row.transferOutQuantity);
      m.totalAvailable += toNum(row.availableStock);

      m.sites.push({
        siteId,
        siteName,
        purchaseQuantity: row.purchaseQuantity,
        purchaseDetails: row.purchaseDetails,
        usedQuantity: row.usedQuantity,
        usedDetails: row.usedDetails,
        transferInQuantity: row.transferInQuantity,
        transferInDetails: row.transferInDetails,
        transferOutQuantity: row.transferOutQuantity,
        transferOutDetails: row.transferOutDetails,
        availableStock: row.availableStock,
      });
    }
  }

  const list = Array.from(byMaterial.values());
  for (const m of list) {
    m.activeSites = new Set(m.sites.map((s) => s.siteId)).size;
  }
  list.sort((a, b) => a.materialName.localeCompare(b.materialName));
  return list;
}

/** Indian-grouped quantity formatting, trimming needless decimals. */
export const fmtQty = (n: number): string =>
  (Math.round(n * 100) / 100).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });