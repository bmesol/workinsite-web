export interface InventoryStockReportParams {
  SiteId?: number;
  FromDate: string; // dd-mm-yyyy
  ToDate: string;   // dd-mm-yyyy
  PageNumber: number;
  PageSize: number;
}
