import React, { useEffect, useState } from 'react';
import { colors, borderRadius, spacing, typography, shadow } from '@propflow/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const typeStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: colors.white, border: colors.success, icon: '✓' },
  error: { bg: colors.white, border: colors.error, icon: '✕' },
  warning: { bg: colors.white, border: colors.warning, icon: '⚠' },
  info: { bg: colors.white, border: colors.info, icon: 'ℹ' },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const style = typeStyles[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: spacing[6],
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: style.bg,
    borderLeft: `4px solid ${style.border}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadow.lg,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    zIndex: 1100,
    maxWidth: '90vw',
    animation: 'slideUp 0.3s ease',
  };

  const iconStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: style.border,
    color: colors.white,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    flexShrink: 0,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: typography.fontSizes.sm,
    color: colors.gray[700],
    lineHeight: 1.4,
  };

  const closeStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.gray[400],
    fontSize: typography.fontSizes.lg,
    padding: spacing[1],
    marginLeft: spacing[2],
    lineHeight: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{style.icon}</div>
      <span style={messageStyle}>{message}</span>
      <button style={closeStyle} onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (index: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing[6],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        zIndex: 1100,
      }}
    >
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} onClose={() => onRemove(index)} />
      ))}
    </div>
  );
};
