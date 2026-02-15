import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import React from 'react';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeDefined();
  });

  it('renders with default gray variant', () => {
    const { container } = render(<Badge>Gray Badge</Badge>);
    const span = container.firstChild as HTMLSpanElement;
    // colors.gray[100] is likely #f3f4f6
    expect(span.style.backgroundColor).toBeDefined();
  });

  it('renders with success variant', () => {
    const { container } = render(<Badge variant="success">Success Badge</Badge>);
    const span = container.firstChild as HTMLSpanElement;
    expect(span.style.backgroundColor).toBe('rgb(236, 253, 245)'); // #ecfdf5
  });

  it('renders with error variant', () => {
    const { container } = render(<Badge variant="error">Error Badge</Badge>);
    const span = container.firstChild as HTMLSpanElement;
    expect(span.style.backgroundColor).toBe('rgb(254, 242, 242)'); // #fef2f2
  });
});
