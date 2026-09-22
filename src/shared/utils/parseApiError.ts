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
  const err = error as Record<string, any>;
  return (
    err?.response?.data?.message ??
    err?.response?.data?.[0]?.message ??
    err?.message ??
    fallback
  );
};
