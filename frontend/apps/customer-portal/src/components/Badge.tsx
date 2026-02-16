import { borderRadius, colors, spacing, typography } from '@propflow/theme';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
  style?: React.CSSProperties;
}

export const Badge = ({ children, variant = 'gray', style }: BadgeProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.success[50],
          color: colors.success[600],
          borderColor: colors.success[200],
        };
      case 'warning':
        return {
          backgroundColor: colors.warning[50],
          color: colors.warning[600],
          borderColor: colors.warning[200],
        };
      case 'error':
        return {
          backgroundColor: colors.error[50],
          color: colors.error[600],
          borderColor: colors.error[200],
        };
      case 'info':
        return {
          backgroundColor: colors.info[50],
          color: colors.info[600],
          borderColor: colors.info[200],
        };
      default:
        return {
          backgroundColor: colors.gray[100],
          color: colors.gray[600],
          borderColor: colors.gray[200],
        };
    }
  };

  const { backgroundColor, color, borderColor } = getStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${spacing[1]}px ${spacing[3]}px`,
        borderRadius: borderRadius.full,
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.semibold,
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        whiteSpace: 'nowrap',
        letterSpacing: typography.letterSpacing.wide,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
