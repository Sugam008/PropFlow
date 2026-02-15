import React from 'react';
import { colors, borderRadius, spacing, shadow, typography } from '@propflow/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'selectable';
  selected?: boolean;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  selected = false,
  padding = 4,
  style,
  children,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: `${spacing[padding]}px`,
    border: selected ? `2px solid ${colors.primary[500]}` : `1px solid ${colors.border}`,
    boxShadow: variant === 'interactive' ? shadow.base : shadow.sm,
    transition: 'all 0.2s ease',
    cursor: variant === 'interactive' || variant === 'selectable' ? 'pointer' : 'default',
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};
