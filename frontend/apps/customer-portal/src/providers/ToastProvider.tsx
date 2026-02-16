'use client';

import { shadow } from '@propflow/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={20} />;
    case 'error':
      return <XCircle size={20} />;
    case 'warning':
      return <AlertCircle size={20} />;
    case 'info':
    default:
      return <Info size={20} />;
  }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              onClick={() => removeToast(toast.id)}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor:
                  toast.type === 'error'
                    ? 'rgba(239, 68, 68, 0.95)'
                    : toast.type === 'success'
                      ? 'rgba(34, 197, 94, 0.95)'
                      : toast.type === 'warning'
                        ? 'rgba(245, 158, 11, 0.95)'
                        : 'rgba(59, 130, 246, 0.95)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                boxShadow: shadow.lg,
                cursor: 'pointer',
                minWidth: '280px',
                maxWidth: '450px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <ToastIcon type={toast.type} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
