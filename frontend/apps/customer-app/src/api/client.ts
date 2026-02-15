import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '../store/useAuthStore';
import { withRetry, retryConfigs } from '../utils/retry';

const API_BASE_OVERRIDE = process.env.EXPO_PUBLIC_API_BASE_URL;
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BASE_URL = API_BASE_OVERRIDE || `http://${LOCAL_HOST}:8000/api/v1`;

const OFFLINE_QUEUE_KEY = 'propflow_offline_queue';

interface QueuedRequest {
  id: string;
  config: AxiosRequestConfig;
  timestamp: number;
  retryCount: number;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request queue for offline support
let requestQueue: QueuedRequest[] = [];

const loadQueue = async () => {
  try {
    const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    if (stored) {
      requestQueue = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load request queue:', error);
  }
};

const saveQueue = async () => {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(requestQueue));
  } catch (error) {
    console.error('Failed to save request queue:', error);
  }
};

// Load queue on startup
loadQueue();

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle auth refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { token, setToken, logout } = useAuthStore.getState();
    const requestConfig = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - try to refresh token
    if (
      error.response?.status === 401 &&
      token &&
      !requestConfig?._retry &&
      !requestConfig?.url?.includes('/auth/refresh')
    ) {
      requestConfig._retry = true;
      try {
        const refreshResponse = await apiClient.post('/auth/refresh', {
          refresh_token: token,
        });
        const newToken = refreshResponse.data.access_token as string;
        setToken(newToken);

        if (requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient.request(requestConfig);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }

    // Handle 401 with no refresh possible
    if (error.response?.status === 401) {
      logout();
    }

    return Promise.reject(error);
  },
);

// API methods with retry logic
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    withRetry(() => apiClient.get<T>(url, config).then((r) => r.data), retryConfigs.read),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    withRetry(
      () => apiClient.post<T>(url, data, config).then((r) => r.data),
      retryConfigs.critical,
    ),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    withRetry(() => apiClient.put<T>(url, data, config).then((r) => r.data), retryConfigs.critical),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    withRetry(() => apiClient.delete<T>(url, config).then((r) => r.data), retryConfigs.critical),

  // Upload with progress tracking
  upload: async (url: string, formData: FormData, onProgress?: (progress: number) => void) => {
    return withRetry(
      () =>
        apiClient.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = (progressEvent.loaded / progressEvent.total) * 100;
              onProgress(progress);
            }
          },
          timeout: 120000, // 2 minute timeout for uploads
        }),
      retryConfigs.upload,
    );
  },
};

// Offline queue management
export const offlineQueue = {
  add: async (config: AxiosRequestConfig) => {
    const queuedRequest: QueuedRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      config,
      timestamp: Date.now(),
      retryCount: 0,
    };
    requestQueue.push(queuedRequest);
    await saveQueue();
    return queuedRequest.id;
  },

  remove: async (id: string) => {
    requestQueue = requestQueue.filter((req) => req.id !== id);
    await saveQueue();
  },

  getAll: () => requestQueue,

  clear: async () => {
    requestQueue = [];
    await saveQueue();
  },

  process: async () => {
    if (requestQueue.length === 0) return;

    console.log(`[OfflineQueue] Processing ${requestQueue.length} queued requests...`);

    for (const request of [...requestQueue]) {
      try {
        await apiClient.request(request.config);
        await offlineQueue.remove(request.id);
        console.log(`[OfflineQueue] Processed request ${request.id}`);
      } catch (error) {
        console.error(`[OfflineQueue] Failed to process request ${request.id}:`, error);
        // Keep in queue for next attempt
      }
    }
  },
};

export default apiClient;
