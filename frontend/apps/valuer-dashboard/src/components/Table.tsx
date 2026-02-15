import { colors, spacing, typography } from '@propflow/theme';
import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: {
    bivarianceHack(item: T): React.ReactNode;
  }['bivarianceHack'];
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectedId?: string | number;
}

export const Table = <T extends { id: string | number }>({ columns, data, onRowClick, selectedId }: TableProps<T>) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', backgroundColor: colors.white, borderRadius: 8, border: `1px solid ${colors.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.gray[50] }}>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col"
                style={{
                padding: `${spacing[4]}px ${spacing[6]}px`,
                fontSize: typography.fontSizes.xs,
                fontWeight: typography.fontWeights.semibold,
                color: colors.gray[500],
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <tr 
                  key={item.id} 
                  onClick={() => onRowClick?.(item)}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(item);
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? 'row' : undefined}
                  aria-selected={onRowClick ? isSelected : undefined}
                  style={{ 
                    borderBottom: `1px solid ${colors.border}`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? colors.primary[50] : 'transparent',
                    boxShadow: isSelected ? `inset 4px 0 0 ${colors.primary[500]}` : 'none',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => { 
                    if (!isSelected && onRowClick) e.currentTarget.style.backgroundColor = colors.gray[50]; 
                  }}
                  onMouseLeave={(e) => { 
                    if (!isSelected && onRowClick) e.currentTarget.style.backgroundColor = 'transparent'; 
                  }}
                >
                  {columns.map((column, index) => (
                    <td key={index} style={{
                      padding: `${spacing[4]}px ${spacing[6]}px`,
                      fontSize: typography.fontSizes.sm,
                      color: isSelected ? colors.primary[900] : colors.gray[700],
                      fontWeight: isSelected ? typography.fontWeights.medium : typography.fontWeights.normal
                    }}>
                      {column.render ? column.render(item) : (item[column.key as keyof T] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} style={{
                padding: `${spacing[10]}px`,
                textAlign: 'center',
                color: colors.gray[400],
                fontSize: typography.fontSizes.sm
              }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
