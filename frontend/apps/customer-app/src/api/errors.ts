import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  detail: string | { msg: string }[];
  error_type?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    if (data?.detail) {
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail) && data.detail.length > 0) {
        return data.detail[0].msg || 'Validation error';
      }
    }

    switch (error.response?.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        if (error.code === 'ERR_NETWORK') {
          return 'Network error. Please check your internet connection.';
        }
        return 'An unexpected error occurred.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};
