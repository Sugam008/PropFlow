import { describe, it, expect, vi, beforeEach } from 'vitest';
import { valuationApi } from './valuations';
import { apiClient } from './client';

// Mock apiClient
vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('valuationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createValuation calls correct endpoint with data', async () => {
    const mockData = {
      property_id: '1',
      estimated_value: 500000,
      confidence_score: 0.9,
      valuation_date: new Date().toISOString(),
    };
    (apiClient.post as any).mockResolvedValueOnce({ data: { id: 'val_1', ...mockData } });

    const result = await valuationApi.createValuation(mockData);

    expect(apiClient.post).toHaveBeenCalledWith('/valuations/', mockData);
    expect(result.id).toBe('val_1');
  });

  it('getValuations calls correct endpoint', async () => {
    const mockData = [{ id: 'val_1', estimated_value: 500000 }];
    (apiClient.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await valuationApi.getValuations({ limit: 5 });

    expect(apiClient.get).toHaveBeenCalledWith('/valuations/', {
      params: { limit: 5 },
    });
    expect(result).toEqual(mockData);
  });
});
