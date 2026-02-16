import { useQuery } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Table } from '../src/components/Table';
import { useToast } from '../src/providers/ToastProvider';
import Home from './page';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../src/providers/ToastProvider', () => ({
  useToast: vi.fn(),
}));

vi.mock('../src/api/properties', () => ({
  propertyApi: {
    getProperties: vi.fn(),
  },
}));

vi.mock('../src/store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({ isAuthenticated: true })),
}));

vi.mock('@propflow/theme', () => ({
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
    success: { 50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 500: '#22C55E', 600: '#16A34A' },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
    },
    info: { 50: '#ECFEFF', 200: '#A5F3FC', 500: '#06B6D4', 600: '#0891B2' },
    error: { 50: '#FEF2F2', 200: '#FECACA', 600: '#DC2626' },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    white: '#FFFFFF',
  },
  shadow: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 10: 40, 12: 48, 20: 80 },
  typography: {
    fontSizes: { xs: 12, sm: 14, base: 16, lg: 18 },
    fonts: { mono: 'monospace' },
    fontWeights: { medium: '500', semibold: '600', bold: '700' },
    letterSpacing: { wide: '0.025em' },
  },
  borderRadius: { lg: 8, xl: 12, full: 9999 },
  glass: {
    card: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' },
  },
}));

// Mock next/dynamic to render components synchronously
vi.mock('next/dynamic', () => ({
  default: () => {
    return (props: any) => {
      // Directly render Table for table props
      if ('columns' in props && 'data' in props) {
        return <Table {...props} />;
      }
      // For other dynamic components (Map, Modal), return placeholder
      return <div data-testid="dynamic-component">Dynamic Component</div>;
    };
  },
}));

describe('Home Page', () => {
  const mockPush = vi.fn();
  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useToast as any).mockReturnValue({ showToast: mockShowToast });
  });

  it('renders loading state', () => {
    (useQuery as any).mockReturnValue({ isLoading: true });
    render(<Home />);
    expect(screen.getAllByText(/Queue/i).length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    const error = new Error('Failed to fetch');
    (useQuery as any).mockReturnValue({ isLoading: false, error });
    render(<Home />);
    expect(mockShowToast).toHaveBeenCalledWith('Failed to fetch', 'error');
  });

  it('renders property list correctly', () => {
    const properties = [
      {
        id: 'prop_1',
        address: '123 Main St',
        city: 'Mumbai',
        state: 'MH',
        status: 'SUBMITTED',
        property_type: 'APARTMENT',
      },
      {
        id: 'prop_2',
        address: '456 Park Ave',
        city: 'Delhi',
        state: 'DL',
        status: 'DRAFT',
        property_type: 'HOUSE',
      },
    ];
    (useQuery as any).mockReturnValue({ isLoading: false, data: properties });

    render(<Home />);

    expect(screen.getByText('123 Main St')).toBeDefined();
    expect(screen.getByText('456 Park Ave')).toBeDefined();
    expect(screen.getByText(/Mumbai/)).toBeDefined();
    expect(screen.getByText(/Delhi/)).toBeDefined();
  });

  it('filters properties based on search term', () => {
    const properties = [
      {
        id: 'prop_1',
        address: '123 Main St',
        city: 'Mumbai',
        status: 'SUBMITTED',
        property_type: 'APARTMENT',
      },
      {
        id: 'prop_2',
        address: '456 Park Ave',
        city: 'Delhi',
        status: 'DRAFT',
        property_type: 'HOUSE',
      },
    ];
    (useQuery as any).mockReturnValue({ isLoading: false, data: properties });

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'Main' } });

    expect(screen.getByText('123 Main St')).toBeDefined();
    expect(screen.queryByText('456 Park Ave')).toBeNull();
  });

  it('navigates to property detail on row click', () => {
    const properties = [
      {
        id: 'prop_1',
        address: '123 Main St',
        city: 'Mumbai',
        status: 'SUBMITTED',
        property_type: 'APARTMENT',
      },
    ];
    (useQuery as any).mockReturnValue({ isLoading: false, data: properties });

    render(<Home />);

    // Click on the address text in the table
    const address = screen.getByText('123 Main St');
    fireEvent.click(address);

    expect(mockPush).toHaveBeenCalledWith('/prop_1');
  });
});
