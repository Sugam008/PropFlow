import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

// Mock useAuthStore
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { name: 'Valuer Admin' },
    logout: vi.fn(),
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock @propflow/theme
vi.mock('@propflow/theme', () => ({
  colors: {
    primary: { 500: '#E31E24', 600: '#B81B20' },
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    error: { 600: '#DC2626' },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
  },
  typography: {
    fontSizes: { '2xs': 10, sm: 14, lg: 18 },
    fontWeights: { medium: '500', semibold: '600', bold: '700' },
    lineHeights: { tight: 1.25 },
    letterSpacing: { tight: '-0.025em', wider: '0.05em' },
  },
  borderRadius: { lg: 8, xl: 12 },
  shadow: { '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)', brand: 'none' },
  layout: { sidebarWidth: 280 },
  zIndex: { modal: 50, modalBackdrop: 40 },
}));

describe('Sidebar', () => {
  it('renders logo and application name', () => {
    render(<Sidebar />);
    expect(screen.getByText('PropFlow')).toBeDefined();
  });

  it('renders all menu items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Queue')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
    expect(screen.getByText('Reports')).toBeDefined();
  });

  it('highlights the active link', () => {
    // Already mocked as '/' in setup
    render(<Sidebar />);
    const queueLink = screen.getByText('Queue').closest('a');
    expect(queueLink?.style.backgroundColor).toBeDefined();
  });

  it('renders user profile information', () => {
    render(<Sidebar />);
    expect(screen.getByText('Valuer Admin')).toBeDefined();
    expect(screen.getByText('Logged in as')).toBeDefined();
  });
});
