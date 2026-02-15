import { colors, spacing, typography } from '@propflow/theme';
import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  selectedId?: string | number;
}

export const Table = <T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  selectedId,
}: TableProps<T>) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: 'rgba(249, 250, 251, 0.5)',
            }}
          >
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
                  letterSpacing: '0.05em',
                }}
              >
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
                    borderBottom: `1px solid ${colors.gray[100]}`,
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? `${colors.primary[50]}88` : 'transparent',
                    boxShadow: isSelected ? `inset 4px 0 0 ${colors.primary[500]}` : 'none',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && onRowClick)
                      e.currentTarget.style.backgroundColor = colors.gray[50];
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && onRowClick)
                      e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      style={{
                        padding: `${spacing[5]}px ${spacing[6]}px`, // Increased row height
                        fontSize: typography.fontSizes.sm,
                        color: isSelected ? colors.primary[900] : colors.gray[800],
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {typeof column.render === 'function'
                        ? column.render(item)
                        : (item[column.key as keyof T] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: `${spacing[10]}px`,
                  textAlign: 'center',
                  color: colors.gray[400],
                  fontSize: typography.fontSizes.sm,
                }}
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
