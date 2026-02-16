import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { token, setToken, logout } = useAuthStore.getState();
    const requestConfig = error.config;

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
        const newToken = refreshResponse.data.access_token;
        setToken(newToken);

        if (error.config?.headers) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient.request(error.config);
      } catch {
        logout();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);
