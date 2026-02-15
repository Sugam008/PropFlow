import React from 'react';
import { colors, spacing, typography } from '@propflow/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
}

export const Badge = ({ children, variant = 'gray' }: BadgeProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#ecfdf5', color: colors.success };
      case 'warning':
        return { backgroundColor: '#fffbeb', color: colors.warning };
      case 'error':
        return { backgroundColor: '#fef2f2', color: colors.error };
      case 'info':
        return { backgroundColor: colors.primary[50], color: colors.primary[700] };
      default:
        return { backgroundColor: colors.gray[100], color: colors.gray[600] };
    }
  };

  const { backgroundColor, color } = getStyles();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacing[1]}px ${spacing[3]}px`,
      borderRadius: 9999,
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.medium,
      backgroundColor,
      color,
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  );
};
