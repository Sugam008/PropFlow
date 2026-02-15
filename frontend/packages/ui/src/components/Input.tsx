import React, { forwardRef } from 'react';
import { colors, borderRadius, spacing, typography } from '@propflow/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, style, ...props }, ref) => {
    const hasError = !!error;

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[1],
    };

    const labelStyle: React.CSSProperties = {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: hasError ? colors.error : colors.gray[700],
    };

    const inputContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      border: `1px solid ${hasError ? colors.error : colors.border}`,
      backgroundColor: colors.input,
      padding: `${spacing[2]}px ${spacing[3]}px`,
      transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const inputStyle: React.CSSProperties = {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: typography.fontSizes.base,
      fontFamily: typography.fonts.sans,
      color: colors.foreground,
      backgroundColor: 'transparent',
      minWidth: 0,
    };

    const iconStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.gray[400],
      marginRight: leftIcon ? spacing[2] : 0,
      marginLeft: rightIcon ? spacing[2] : 0,
    };

    const hintStyle: React.CSSProperties = {
      fontSize: typography.fontSizes.xs,
      color: hasError ? colors.error : colors.gray[500],
    };

    return (
      <div style={containerStyle}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={inputContainerStyle}>
          {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
          <input ref={ref} style={inputStyle} {...props} />
          {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
        </div>
        {(error || hint) && <span style={hintStyle}>{error || hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
