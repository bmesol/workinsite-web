import type { DateRange } from '../DTOs/WorkerreportProps';

// dd-mm-yyyy format
export const formatDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const getWeekRange = (option: 'currentWeek' | 'lastWeek'): DateRange => {
  const today = new Date();
  const day = today.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;

  const from = new Date(today);
  from.setDate(today.getDate() + diffToMon + (option === 'lastWeek' ? -7 : 0));
  const to = new Date(from);
  to.setDate(from.getDate() + 6);

  return { from: formatDate(from), to: formatDate(to) };
};

export const formatINR = (val: number | string): string =>
  `₹${parseFloat(String(val || 0)).toLocaleString('en-IN')}`;

// dd-mm-yyyy → yyyy-mm-dd (for HTML date input)
export const toInputDate = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return '';
  const [d, m, y] = ddmmyyyy.split('-');
  return `${y}-${m}-${d}`;
};

// yyyy-mm-dd → dd-mm-yyyy
export const fromInputDate = (yyyymmdd: string): string => {
  if (!yyyymmdd) return '';
  const [y, m, d] = yyyymmdd.split('-');
  return `${d}-${m}-${y}`;
};

export const validateDates = (
  from: string,
  to: string,
): { fromDate: string; toDate: string } => {
  const err = { fromDate: '', toDate: '' };
  if (!from && !to) { err.fromDate = 'Date is required'; return err; }
  if (!from)        { err.fromDate = 'From Date is required'; return err; }
  if (!to)          { err.toDate   = 'To Date is required'; return err; }

  const [fd, fm, fy] = from.split('-').map(Number);
  const [td, tm, ty] = to.split('-').map(Number);
  if (new Date(fy, fm - 1, fd) > new Date(ty, tm - 1, td))
    err.toDate = 'To Date must be on or after From Date';

  return err;
};