import { describe, it, expect } from 'vitest';
import { apiClient } from './client';

describe('apiClient', () => {
  it('is initialized with correct configuration', () => {
    // Check if baseURL is defined (might be default localhost or from env)
    expect(apiClient.defaults.baseURL).toBeDefined();
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('has interceptors defined', () => {
    // Verify interceptors are registered
    // @ts-ignore - accessing internal handlers for verification
    expect(apiClient.interceptors.request.handlers.length).toBeGreaterThan(0);
    // @ts-ignore
    expect(apiClient.interceptors.response.handlers.length).toBeGreaterThan(0);
  });
});
