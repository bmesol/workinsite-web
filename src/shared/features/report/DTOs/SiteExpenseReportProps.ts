export interface SiteExpensePurchase {
  id: number;
  date: string;
  billNumber: string | number;
  supplier: {
    id: number;
    name: string;
  };
  totalAmount: string | number;
}

export interface SiteExpenseMaterial {
  material: {
    id: number;
    name: string;
    hsnCode: string | null;
    unit: {
      id: number;
      isActive: boolean;
      name: string;
      note: string | null;
    };
  };
  totalQuantity: string | number;
  totalAmount: string | number;
}

export interface SiteExpenseClientTransaction {
  id: number;
  date: string;
  client: {
    id: number;
    name: string;
  };
  amount: string | number;
  paymentMethod: string;
  remark?: string;
}

export interface SiteExpenseWorker {
  id: number;
  name: string;
  workerCategoryName: string;
  totalAmount: string | number;
}

export interface SiteExpenseReportItem {
  siteId: number;
  siteName: string;
  totalPurchaseAmount: number | string;
  totalMaterialAmount: number | string;
  totalClientTransactionAmount: number | string;
  totalWorkerSalaryAmount: number | string;
  totalExpense: number | string;
  purchases: SiteExpensePurchase[];
  materials: SiteExpenseMaterial[];
  clientTransactions: SiteExpenseClientTransaction[];
  workers: SiteExpenseWorker[];
}

export type SiteExpenseReportResponse = SiteExpenseReportItem[];

export interface SiteExpenseReportParams {
  SiteId?: number;
  FromDate: string;
  ToDate: string;
}
