import React from 'react';
import { colors, borderRadius, spacing, typography } from '@propflow/theme';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'review';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: colors.gray[100], color: colors.gray[700] },
  success: { bg: colors.successLight, color: colors.success },
  warning: { bg: colors.warningLight, color: colors.warning },
  error: { bg: colors.errorLight, color: colors.error },
  info: { bg: colors.infoLight, color: colors.info },
  pending: { bg: colors.warningLight, color: colors.warning },
  review: { bg: colors.infoLight, color: colors.info },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  style,
  children,
  ...props
}) => {
  const variantStyle = variantStyles[variant];

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeights.medium,
    whiteSpace: 'nowrap',
    ...variantStyle,
    ...(size === 'sm'
      ? { padding: `${spacing[1]}px ${spacing[2]}px`, fontSize: typography.fontSizes.xs }
      : { padding: `${spacing[1]}px ${spacing[3]}px`, fontSize: typography.fontSizes.sm }),
    ...style,
  };

  return (
    <span style={baseStyle} {...props}>
      {children}
    </span>
  );
};
