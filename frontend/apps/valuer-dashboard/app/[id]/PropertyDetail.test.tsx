import { useQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '../../src/providers/ToastProvider';
import PropertyDetailPage from './page';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('../../src/providers/ToastProvider', () => ({
  useToast: vi.fn(),
}));

vi.mock('../../src/api/properties', () => ({
  propertyApi: {
    getProperty: vi.fn(),
    getPhotos: vi.fn(),
    getComps: vi.fn(),
    getProperties: vi.fn(),
    requestFollowUp: vi.fn(),
  },
}));

vi.mock('../../src/components/Modal', () => ({
  Modal: ({ isOpen, title, children }: any) => isOpen ? (
    <div data-testid="mock-modal">
      <h2>{title}</h2>
      {children}
    </div>
  ) : null,
}));

vi.mock('next/dynamic', () => ({
  default: () => {
    return (props: any) => {
      if ('isOpen' in props) {
        return props.isOpen ? (
          <div data-testid="mock-modal">
            <h2>{props.title}</h2>
            {props.children}
          </div>
        ) : null;
      }

      if ('columns' in props && 'data' in props) {
        return <div data-testid="mock-table">Table View</div>;
      }

      return <div data-testid="mock-map">Map View</div>;
    };
  },
}));

describe('PropertyDetail Page', () => {
  const mockPush = vi.fn();
  const mockShowToast = vi.fn();

  const mockProperty = {
    id: 'prop_1',
    address: '123 Main St',
    city: 'Mumbai',
    state: 'MH',
    property_type: 'APARTMENT',
    status: 'SUBMITTED',
    created_at: new Date().toISOString(),
    user_id: 'user_1'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: 'prop_1' });
    (useRouter as any).mockReturnValue({ push: mockPush });
    (useToast as any).mockReturnValue({ showToast: mockShowToast });
    
    // Default implementation for useQuery
    (useQuery as any).mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === 'property') return { data: mockProperty, isLoading: false };
      if (queryKey[0] === 'property-photos') return { data: [], isLoading: false };
      if (queryKey[0] === 'comps') return { data: [], isLoading: false };
      if (queryKey[0] === 'properties') return { data: [mockProperty], isLoading: false };
      return { data: null, isLoading: false };
    });
  });

  it('renders loading state', () => {
    (useQuery as any).mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === 'property') return { isLoading: true };
      return { data: [], isLoading: false };
    });
    render(<PropertyDetailPage />);
    expect(screen.getAllByText(/Loading/i)).toBeDefined();
  });

  it('renders property details correctly', () => {
    render(<PropertyDetailPage />);
    
    expect(screen.getAllByText('123 Main St').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mumbai/).length).toBeGreaterThan(0);
    expect(screen.getByText('APARTMENT')).toBeDefined();
  });

  it('renders action buttons', () => {
    render(<PropertyDetailPage />);
    expect(screen.getByText(/Approve Valuation/i)).toBeDefined();
    expect(screen.getByText(/Request Follow-up/i)).toBeDefined();
  });

  it('opens valuation modal on button click', async () => {
    const user = userEvent.setup();
    render(<PropertyDetailPage />);
    
    const approveButton = screen.getByRole('button', { name: /Approve Valuation/i });
    await user.click(approveButton);
    
    expect(await screen.findByTestId('mock-modal')).toBeDefined();
    expect(screen.getByText(/Submit Valuation/i)).toBeDefined();
  });

  it('opens follow-up modal on button click', async () => {
    const user = userEvent.setup();
    render(<PropertyDetailPage />);
    
    const followUpButton = screen.getByRole('button', { name: /Request Follow-up/i });
    await user.click(followUpButton);
    
    expect(await screen.findByTestId('mock-modal')).toBeDefined();
    expect(screen.getAllByText(/Request Follow-up/i).length).toBeGreaterThan(1);
  });
});
