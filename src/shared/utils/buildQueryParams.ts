export const buildQueryParams = (params: Record<string, unknown>): string => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      v.forEach(item => {
        if (item !== undefined && item !== null && item !== '') {
          q.append(k, String(item));
        }
      });
    } else {
      q.append(k, String(v));
    }
  });
  return q.toString();
};
