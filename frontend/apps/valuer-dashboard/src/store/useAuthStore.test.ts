import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().logout();
  });

  it('starts with initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('updates state with setAuth', () => {
    const user = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'VALUER',
      is_active: true,
    };
    const token = 'test-token';

    useAuthStore.getState().setAuth(user, token);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('updates token and isAuthenticated correctly', () => {
    const user = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'VALUER',
      is_active: true,
    };
    
    // Set user first
    useAuthStore.setState({ user });
    
    useAuthStore.getState().setToken('new-token');

    const state = useAuthStore.getState();
    expect(state.token).toBe('new-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('clears state on logout', () => {
    const user = {
      id: '1',
      phone: '+1234567890',
      name: 'Test User',
      role: 'VALUER',
      is_active: true,
    };
    useAuthStore.getState().setAuth(user, 'token');
    
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
