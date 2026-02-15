import { colors, spacing } from '@propflow/theme';
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
  console.log(`Modal "${title}" isOpen:`, isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
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
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: spacing[4],
            backdropFilter: 'blur(20px)',
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
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: 600,
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 32,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              outline: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: `${spacing[8]}px ${spacing[8]}px ${spacing[4]}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3
                id={titleId}
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: colors.gray[900],
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'rgba(15, 23, 42, 0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.gray[400],
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.1)';
                  e.currentTarget.style.color = colors.gray[900];
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)';
                  e.currentTarget.style.color = colors.gray[400];
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: spacing[8],
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                style={{
                  padding: `${spacing[4]}px ${spacing[8]}px ${spacing[8]}px`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: spacing[4],
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
