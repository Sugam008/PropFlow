import { colors, spacing, typography } from '@propflow/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { MouseEvent, ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Simple focus management: focus the modal container when it opens
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const titleId = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
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
            backdropFilter: 'blur(2px)'
          }}
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              outline: 'none'
            }}
          >
            {/* Header */}
            <div style={{
              padding: `${spacing[4]}px ${spacing[6]}px`,
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 
                id={titleId}
                style={{
                  fontSize: typography.fontSizes.lg,
                  fontWeight: typography.fontWeights.semibold,
                  color: colors.gray[900],
                  margin: 0
                }}
              >
                {title}
              </h3>
              <button 
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.gray[400],
                  padding: spacing[1],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: spacing[6],
              overflowY: 'auto',
              flex: 1
            }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{
                padding: `${spacing[4]}px ${spacing[6]}px`,
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: spacing[3]
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
