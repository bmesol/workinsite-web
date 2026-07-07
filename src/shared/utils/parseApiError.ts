export const parseApiError = (
  error: unknown,
  fallback = 'An unexpected error occurred',
): string => {
  if (!error || typeof error !== 'object') return fallback;
  const err = error as Record<string, any>;
  return (
    err?.response?.data?.message ??
    err?.response?.data?.[0]?.message ??
    err?.message ??
    fallback
  );
};