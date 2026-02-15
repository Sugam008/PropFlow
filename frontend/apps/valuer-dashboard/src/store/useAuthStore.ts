import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  name: string | null;
  role: string;
  is_active: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append('username', phone);
          formData.append('password', password);

          const response = await fetch(`${API_BASE}/auth/login/access-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Login failed');
          }

          const data: LoginResponse = await response.json();

          const userResponse = await fetch(`${API_BASE}/users/me`, {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          let user: User;
          if (userResponse.ok) {
            user = await userResponse.json();
          } else {
            user = {
              id: '',
              phone: phone,
              name: null,
              role: 'VALUER',
              is_active: true,
            };
          }

          set({
            user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
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
      name: 'propflow-valuer-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
