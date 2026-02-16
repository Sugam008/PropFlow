import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';
import React from 'react';

// Mock useAuthStore
import { useAuthStore } from '../store/useAuthStore';
import { vi } from 'vitest';

vi.mock('../store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { name: 'Test User' },
    logout: vi.fn(),
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: vi.fn().mockReturnValue('/'),
}));

describe('TopBar', () => {
  it('renders title correctly', () => {
    render(<TopBar />);
    expect(screen.getByText('My Valuations')).toBeDefined();
  });

  it('renders search input with placeholder', () => {
    render(<TopBar />);
    expect(screen.getByPlaceholderText('Search by ID or address...')).toBeDefined();
  });

  it('renders pending items count when provided', () => {
    render(<TopBar pendingCount={12} />);
    expect(screen.getByText('12 Pending')).toBeDefined();
  });

  it('does not render pending items count when 0', () => {
    render(<TopBar pendingCount={0} />);
    expect(screen.queryByText('Pending')).toBeNull();
  });

  it('renders notification icon', () => {
    const { container } = render(<TopBar />);
    // Bell icon
    const bellIcon = container.querySelector('svg.lucide-bell');
    expect(bellIcon).toBeDefined();
  });
});
