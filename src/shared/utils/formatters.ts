// ── Slash format (dd/mm/yyyy) ─────────────────────────────────────────────────
// Used by: attendance, transactions, materials, curing, DatePicker

export const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatStringToDate = (date: string): Date | null => {
  if (!date) return null;
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
};

export const getWeekRange = (type: 'lastWeek' | 'currentWeek'): { from: string; to: string } => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const start = new Date(today);
  start.setDate(today.getDate() - diffToMonday + (type === 'currentWeek' ? 0 : -7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { from: formatDateToString(start), to: formatDateToString(end) };
};

export function getStatusFromDates(endDate: string): 'On Going' | 'Completed' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [day, month, year] = endDate.split('/').map(Number);
  const end = new Date(year, month - 1, day);
  return end >= today ? 'On Going' : 'Completed';
}

export const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

// ── Hyphen format (dd-mm-yyyy) ────────────────────────────────────────────────
// Used by: report feature (supervisor-attendance, inventory-stock, worker-report)

export const formatDateHyphen = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const getWeekRangeHyphen = (option: 'currentWeek' | 'lastWeek'): { from: string; to: string } => {
  const today = new Date();
  const day = today.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const from = new Date(today);
  from.setDate(today.getDate() + diffToMon + (option === 'lastWeek' ? -7 : 0));
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  return { from: formatDateHyphen(from), to: formatDateHyphen(to) };
};

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

// ── Currency ──────────────────────────────────────────────────────────────────
export const formatINR = (val: number | string): string =>
  `₹${parseFloat(String(val || 0)).toLocaleString('en-IN')}`;
