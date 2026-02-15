import { borderRadius, colors, glass, shadow, spacing, typography } from '@propflow/theme';
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  variant?: 'white' | 'glass';
}

export const Card = ({ title, children, footer, style, variant = 'white' }: CardProps) => {
  const baseStyle =
    variant === 'glass'
      ? glass.card
      : {
          backgroundColor: colors.white,
          borderRadius: borderRadius.xl,
          border: `1px solid ${colors.border}`,
          boxShadow: shadow.sm,
        };

  return (
    <div
      style={
        {
          ...baseStyle,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          ...style,
        } as React.CSSProperties
      }
    >
      {title && (
        <h2
          style={{
            padding: `${spacing[4]}px ${spacing[5]}px`,
            borderBottom: `1px solid ${colors.border}`,
            fontSize: typography.fontSizes.base,
            fontWeight: typography.fontWeights.semibold,
            color: colors.gray[900],
            margin: 0,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          {title}
        </h2>
      )}

      <div style={{ flex: 1 }}>{children}</div>

      {footer && (
        <div
          style={{
            padding: `${spacing[3]}px ${spacing[5]}px`,
            backgroundColor: colors.gray[50],
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
