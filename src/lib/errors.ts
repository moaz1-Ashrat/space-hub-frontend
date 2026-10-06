import { AxiosError } from 'axios';
import type { ApiError } from '../types';

// ============================================
// Extract Error Message from Axios Error
// ============================================
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;

    // 422 Validation errors
    if (error.response?.status === 422 && data?.errors) {
      return data.message || 'Validation failed';
    }

    // Backend message
    if (data?.message) {
      return data.message;
    }

    // Network / timeout
    if (!error.response) {
      return 'Network error. Please check your connection.';
    }

    return 'An unexpected error occurred.';
  }

  return 'An unexpected error occurred.';
}

// ============================================
// Extract Field-level Errors (422)
// ============================================
export function getFieldErrors(
  error: unknown
): Record<string, string[]> {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;

    if (error.response?.status === 422 && data?.errors) {
      return data.errors;
    }
  }

  return {};
}

// ============================================
// Check if Error is Suspended Account (403)
// ============================================
export function isSuspendedAccount(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    return (
      error.response?.status === 403 &&
      !!data?.message &&
      data.message.toLowerCase().includes('suspended')
    );
  }
  return false;
}