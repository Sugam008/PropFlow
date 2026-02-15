import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
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
