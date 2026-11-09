import type { AxiosError } from 'axios';

export class AppError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;

  const axiosErr = error as AxiosError<any>;
  const status = axiosErr?.response?.status ?? 0;
  const message =
    axiosErr?.response?.data?.message ??
    axiosErr?.response?.data?.[0]?.message ??
    axiosErr?.message ??
    'An unexpected error occurred';
  const code: string | undefined =
    axiosErr?.response?.data?.code ?? axiosErr?.code;

  return new AppError(message, status, code);
};

export const parseApiError = (
  error: unknown,
  fallback = 'An unexpected error occurred',
): string => {
  if (error instanceof AppError) return error.message || fallback;

  if (!error || typeof error !== 'object') return fallback;

  const get = (v: unknown, k: string): unknown =>
    v !== null && typeof v === 'object' ? (v as Record<string, unknown>)[k] : undefined;

  const str = (v: unknown): string | undefined =>
    typeof v === 'string' ? v : undefined;

  const data = get(get(error, 'response'), 'data');
  const firstItem = Array.isArray(data) ? (data as unknown[])[0] : undefined;

  return (
    str(get(data, 'message')) ??
    str(get(firstItem, 'message')) ??
    str(get(error, 'message')) ??
    fallback
  );
};
