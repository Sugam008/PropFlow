import React from 'react';
import { colors, spacing, typography } from '@propflow/theme';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card = ({ title, children, footer, style }: CardProps) => {
  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...style
    }}>
      {title && (
        <h2 style={{
          padding: `${spacing[4]}px ${spacing[6]}px`,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: typography.fontSizes.base,
          fontWeight: typography.fontWeights.semibold,
          color: colors.gray[900],
          margin: 0
        }}>
          {title}
        </h2>
      )}
      
      <div style={{ padding: `${spacing[6]}px`, flex: 1 }}>
        {children}
      </div>
      
      {footer && (
        <div style={{
          padding: `${spacing[4]}px ${spacing[6]}px`,
          backgroundColor: colors.gray[50],
          borderTop: `1px solid ${colors.border}`
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};
