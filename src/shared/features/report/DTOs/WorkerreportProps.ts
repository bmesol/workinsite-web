// ─── Summary List Item (WorkerReportPage) ────────────────────────────────────

export interface WorkerReportSummaryItem {
  workerId: number;
  workerName: string;
  workerCategoryName: string;
  amount: string;
}

export interface WorkerReportSummaryResponse {
  items: WorkerReportSummaryItem[];
  totalAmount: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter / UI Types ────────────────────────────────────────────────────────

export type DateRangeOption = 'lastWeek' | 'currentWeek' | 'custom';

export interface DateRange {
  from: string;
  to: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SiteOption {
  id: number;
  name: string;
}

export interface WorkerOption {
  id: number;
  name: string;
  workerCategory: {
    id: number;
    name: string;
  };
}

// ─── API Params ───────────────────────────────────────────────────────────────

export interface AttendanceReportParams {
  SiteId?: number;
  WorkerId?: number;
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
  IgnorePagination?: boolean;
}