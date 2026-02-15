import React, { useEffect, useRef } from 'react';
import { colors, borderRadius, spacing, typography, shadow } from '@propflow/theme';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: 360,
    md: 480,
    lg: 640,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing[4],
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: sizeMap[size],
    maxHeight: '90vh',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadow.xl,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[4]}px ${spacing[5]}px`,
    borderBottom: `1px solid ${colors.border}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.gray[800],
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: borderRadius.md,
    color: colors.gray[500],
    fontSize: typography.fontSizes.xl,
    transition: 'background-color 0.2s',
  };

  const bodyStyle: React.CSSProperties = {
    padding: spacing[5],
    overflowY: 'auto',
    flex: 1,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div ref={modalRef} style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {showCloseButton && (
            <button style={closeButtonStyle} onClick={onClose} aria-label="Close modal">
              ×
            </button>
          )}
        </div>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
};
