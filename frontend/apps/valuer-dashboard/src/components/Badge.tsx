import React from 'react';
import { colors, spacing, typography, borderRadius } from '@propflow/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
}

export const Badge = ({ children, variant = 'gray' }: BadgeProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: colors.success[50], color: colors.success[600] };
      case 'warning':
        return { backgroundColor: colors.warning[50], color: colors.warning[600] };
      case 'error':
        return { backgroundColor: colors.error[50], color: colors.error[600] };
      case 'info':
        return { backgroundColor: colors.info[50], color: colors.info[600] };
      default:
        return { backgroundColor: colors.gray[100], color: colors.gray[600] };
    }
  };

  const { backgroundColor, color } = getStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${spacing[1]}px ${spacing[3]}px`,
        borderRadius: borderRadius.full,
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        backgroundColor,
        color,
        whiteSpace: 'nowrap',
        letterSpacing: typography.letterSpacing.wide,
      }}
    >
      {children}
    </span>
  );
};
