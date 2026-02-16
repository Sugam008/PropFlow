import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';

interface User {
  id: string;
  phone: string;
  name: string | null;
  role: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      requestOtp: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.requestOtp({ phone });
          set({ isLoading: false, error: null });
          return true;
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Failed to send OTP';
          set({ isLoading: false, error: message });
          return false;
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.verifyOtp({ phone, otp });
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Invalid OTP';
          set({ isLoading: false, error: message, isAuthenticated: false });
          return false;
        }
      },

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: state.user !== null,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false, error: null }),
    }),
    {
      name: 'propflow-customer-auth',
    },
  ),
);
