import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: AxiosError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error: AxiosError) => {
    // Retry on network errors
    if (!error.response) return true;

    // Retry on 5xx errors
    if (error.response.status >= 500 && error.response.status < 600) return true;

    // Retry on 429 (rate limit)
    if (error.response.status === 429) return true;

    // Don't retry on 4xx errors (client errors)
    return false;
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const retryConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      if (attempt < retryConfig.maxRetries) {
        const axiosError = error as AxiosError;
        if (retryConfig.shouldRetry(axiosError)) {
          // Exponential backoff
          const delay = retryConfig.retryDelay * Math.pow(2, attempt);
          console.log(
            `[Retry] Attempt ${attempt + 1}/${retryConfig.maxRetries} failed, retrying in ${delay}ms...`,
          );
          await sleep(delay);
          continue;
        }
      }

      // Don't retry, throw the error
      throw error;
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Wrapper for API calls with retry
export function createRetryWrapper(config: Partial<RetryConfig> = {}) {
  return function retry<T>(fn: () => Promise<T>): Promise<T> {
    return withRetry(fn, config);
  };
}

// Specific retry configurations
export const retryConfigs = {
  // For critical operations (login, submit)
  critical: {
    maxRetries: 5,
    retryDelay: 2000,
  },
  // For uploads (photos)
  upload: {
    maxRetries: 3,
    retryDelay: 3000,
  },
  // For read operations
  read: {
    maxRetries: 2,
    retryDelay: 1000,
  },
};
