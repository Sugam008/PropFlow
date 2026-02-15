import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from './Table';
import React from 'react';

describe('Table', () => {
  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
  ];

  const data = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('renders headers correctly', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
  });

  it('renders data correctly', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
  });

  it('renders custom content using render function', () => {
    const customColumns = [
      { 
        header: 'ID', 
        key: 'id', 
        render: (item: { id: string }) => <span>ID: {item.id}</span> 
      },
    ];
    render(<Table columns={customColumns} data={data} />);
    expect(screen.getByText('ID: 1')).toBeDefined();
  });

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn();
    render(<Table columns={columns} data={data} onRowClick={onRowClick} />);
    
    const row = screen.getByText('Item 1').closest('tr');
    if (row) fireEvent.click(row);
    
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders empty message when no data is provided', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('No data found')).toBeDefined();
  });
});
