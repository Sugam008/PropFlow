import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import React from 'react';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(<Card title="Test Title">Card Content</Card>);
    expect(screen.getByText('Test Title')).toBeDefined();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<div>Footer Content</div>}>Card Content</Card>);
    expect(screen.getByText('Footer Content')).toBeDefined();
  });

  it('does not render title section when title is not provided', () => {
    const { container } = render(<Card>Card Content</Card>);
    // The first div should be the card itself, the second should be the children container
    // If title was there, it would be between them.
    expect(container.querySelectorAll('div').length).toBe(2);
  });
});
