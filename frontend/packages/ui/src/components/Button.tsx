import React from 'react';
import { colors, borderRadius, spacing, typography, shadow } from '@propflow/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, style, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeights.medium,
      fontFamily: typography.fonts.sans,
      cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      border: '1px solid transparent',
      opacity: props.disabled || isLoading ? 0.6 : 1,
    };

    const variants: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.white,
      },
      secondary: {
        backgroundColor: colors.secondary[500],
        color: colors.white,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
        color: colors.foreground,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.foreground,
      },
    };

    const sizes: Record<string, React.CSSProperties> = {
      sm: { padding: `${spacing[1]}px ${spacing[3]}px`, fontSize: typography.fontSizes.xs },
      md: { padding: `${spacing[2]}px ${spacing[4]}px`, fontSize: typography.fontSizes.sm },
      lg: { padding: `${spacing[3]}px ${spacing[6]}px`, fontSize: typography.fontSizes.base },
    };

    const combinedStyle = {
      ...baseStyle,
      ...variants[variant],
      ...sizes[size],
      ...style,
    };

    return (
      <button ref={ref} style={combinedStyle} {...props}>
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
