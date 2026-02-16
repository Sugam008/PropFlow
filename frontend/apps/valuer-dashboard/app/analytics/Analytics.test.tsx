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

vi.mock('../../src/providers/ToastProvider', () => ({
  useToast: vi.fn(() => ({ showToast: vi.fn() })),
}));

vi.mock('@propflow/theme', () => ({
  colors: {
    primary: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
    success: { 50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E', 600: '#16A34A' },
    warning: { 50: '#FFFBEB', 500: '#F59E0B', 600: '#D97706' },
    info: { 500: '#06B6D4' },
    error: { 50: '#FEF2F2', 600: '#DC2626' },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      400: '#9CA3AF',
      500: '#6B7280',
      700: '#374151',
      900: '#111827',
    },
    white: '#FFFFFF',
  },
  shadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  spacing: { 6: 24, 8: 32, 10: 40, 12: 48, 20: 80 },
  glass: {
    card: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' },
    dark: { background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(20px)' },
    light: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' },
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

    expect(screen.getByText(/Performance/i)).toBeDefined();
    expect(screen.getByText(/Analytics/i)).toBeDefined();

    // Total Valuations should be 2
    expect(screen.getByText('Total Valuations')).toBeDefined();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    (useQuery as any).mockReturnValue({ data: [], isLoading: false });

    render(<AnalyticsPage />);

    // Check if 0 is present for Total Valuations
    expect(screen.getAllByText(/0/).length).toBeGreaterThan(0);
  });
});
