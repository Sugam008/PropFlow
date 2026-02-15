import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';
import React from 'react';

describe('TopBar', () => {
  it('renders title correctly', () => {
    render(<TopBar />);
    expect(screen.getByText('Valuation Queue')).toBeDefined();
  });

  it('renders search input with placeholder', () => {
    render(<TopBar />);
    expect(screen.getByPlaceholderText('Search by ID or address...')).toBeDefined();
  });

  it('renders pending items count', () => {
    render(<TopBar />);
    expect(screen.getByText('12 Pending')).toBeDefined();
  });

  it('renders notification icon with indicator', () => {
    const { container } = render(<TopBar />);
    const bellIcon = container.querySelector('svg');
    expect(bellIcon).toBeDefined();
    // Notification indicator dot
    const indicator = container.querySelector('div[style*="background-color: rgb(239, 68, 68)"]');
    expect(indicator).toBeDefined();
  });
});
