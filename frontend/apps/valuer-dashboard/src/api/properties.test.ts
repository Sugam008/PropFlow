import { describe, it, expect, vi, beforeEach } from 'vitest';
import { propertyApi } from './properties';
import { apiClient } from './client';

// Mock apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('propertyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProperties calls correct endpoint', async () => {
    const mockData = [{ id: '1', address: '123 Main St' }];
    (apiClient.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await propertyApi.getProperties({ skip: 0, limit: 10 });

    expect(apiClient.get).toHaveBeenCalledWith('/properties/', {
      params: { skip: 0, limit: 10 },
    });
    expect(result).toEqual(mockData);
  });

  it('getProperty calls correct endpoint', async () => {
    const mockData = { id: '1', address: '123 Main St' };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await propertyApi.getProperty('1');

    expect(apiClient.get).toHaveBeenCalledWith('/properties/1');
    expect(result).toEqual(mockData);
  });

  it('requestFollowUp calls correct endpoint with payload', async () => {
    const mockData = { id: '1', status: 'FOLLOW_UP' };
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockData });

    const result = await propertyApi.requestFollowUp('1', 'Need clearer photos');

    expect(apiClient.patch).toHaveBeenCalledWith('/properties/1', {
      status: 'FOLLOW_UP',
      valuer_notes: 'Need clearer photos',
    });
    expect(result).toEqual(mockData);
  });
});
