import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { authApi } from '../api/auth';

// Mock the auth API
vi.mock('../api/auth', () => ({
  authApi: {
    requestOtp: vi.fn(),
    verifyOtp: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().logout();
    vi.clearAllMocks();
  });

  it('starts with initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles requestOtp success', async () => {
    (authApi.requestOtp as any).mockResolvedValue({ success: true });

    const result = await useAuthStore.getState().requestOtp('+1234567890');

    expect(result).toBe(true);
    expect(authApi.requestOtp).toHaveBeenCalledWith({ phone: '+1234567890' });
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('handles requestOtp failure', async () => {
    (authApi.requestOtp as any).mockRejectedValue({
      response: { data: { detail: 'Failed to send OTP' } },
    });

    const result = await useAuthStore.getState().requestOtp('+1234567890');

    expect(result).toBe(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().error).toBe('Failed to send OTP');
  });

  it('handles verifyOtp success', async () => {
    const mockUser = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'CUSTOMER',
      is_active: true,
    };
    const mockToken = 'test-token';

    (authApi.verifyOtp as any).mockResolvedValue({
      user: mockUser,
      access_token: mockToken,
    });

    const result = await useAuthStore.getState().verifyOtp('+1234567890', '123456');

    expect(result).toBe(true);
    expect(authApi.verifyOtp).toHaveBeenCalledWith({ phone: '+1234567890', otp: '123456' });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles verifyOtp failure', async () => {
    (authApi.verifyOtp as any).mockRejectedValue({
      response: { data: { detail: 'Invalid OTP' } },
    });

    const result = await useAuthStore.getState().verifyOtp('+1234567890', '000000');

    expect(result).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().error).toBe('Invalid OTP');
  });

  it('updates state with setAuth', () => {
    const user = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'CUSTOMER',
      is_active: true,
    };
    const token = 'test-token';

    useAuthStore.getState().setAuth(user, token);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears state on logout', () => {
    const user = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'CUSTOMER',
      is_active: true,
    };
    useAuthStore.getState().setAuth(user, 'token');

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });
});
