import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsPage from './page';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../../src/api/properties', () => ({
  propertyApi: {
    getProperties: vi.fn(),
  },
}));

describe('Analytics Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders metrics based on property data', () => {
    const properties = [
      { id: '1', status: 'VALUED', estimated_value: 1000000 },
      { id: '2', status: 'VALUED', estimated_value: 2000000 },
      { id: '3', status: 'SUBMITTED' },
      { id: '4', status: 'FOLLOW_UP' },
    ];
    (useQuery as any).mockReturnValue({ data: properties, isLoading: false });

    render(<AnalyticsPage />);
    
    expect(screen.getByText('Performance Analytics')).toBeDefined();
    
    // Total Valuations should be 2
    expect(screen.getByText('Total Valuations')).toBeDefined();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    
    // Portfolio Value should be sum of valued properties (30,00,000)
    expect(screen.getByText(/Portfolio Value/)).toBeDefined();
    expect(screen.getByText(/30,00,000/)).toBeDefined();
  });

  it('renders empty state correctly', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false });

    render(<AnalyticsPage />);
    
    // Check if 0 is present for Total Valuations
    expect(screen.getAllByText(/0/).length).toBeGreaterThan(0);
  });
});
