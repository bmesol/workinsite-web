// ─── Attendance Record (WorkerReportDetails page) ────────────────────────────

export interface AttendanceItem {
  attendanceId: number;
  date: string;
  siteId: number;
  siteName: string;
  workerId: number;
  workerName: string;
  workerCategoryName: string;
  amount: string;
}

export interface WorkerReportResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: AttendanceItem[];
}