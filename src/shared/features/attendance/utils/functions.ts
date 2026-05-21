// 1. Converts a Date object to string like "30/05/2025"
export const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// 2. Converts "DD/MM/YYYY" string to a Date object
export const formatStringToDate = (date: string): Date | null => {
  if (!date) return null;
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
};

// 3. Get date range for last week or current week
export const getWeekRange = (type: 'lastWeek' | 'currentWeek') => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const start = new Date(today);
  const offset = type === 'currentWeek' ? 0 : -7;
  start.setDate(today.getDate() - diffToMonday + offset);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    from: formatDateToString(start),
    to: formatDateToString(end),
  };
};