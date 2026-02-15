import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@propflow/theme';

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

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
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
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <TouchableOpacity
            key={toast.id}
            onPress={() => removeToast(toast.id)}
            activeOpacity={0.9}
            style={[
              styles.toast,
              { backgroundColor: toast.type === 'error' ? colors.error : 
                               toast.type === 'success' ? '#10b981' :
                               toast.type === 'warning' ? '#f59e0b' : '#3b82f6' }
            ]}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </TouchableOpacity>
        ))}
      </View>
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing[8],
    left: spacing[4],
    right: spacing[4],
    zIndex: 9999,
    gap: spacing[2],
  },
  toast: {
    padding: spacing[4],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.fonts.sans,
    textAlign: 'center',
  },
});
