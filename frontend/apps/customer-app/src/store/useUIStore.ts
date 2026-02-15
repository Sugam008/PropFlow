import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Modal states
  isModalVisible: boolean;
  modalContent: React.ReactNode | null;

  // Toast queue
  toasts: Toast[];

  // Draft recovery
  showDraftRecovery: boolean;
  savedStep: number;

  // Actions
  setLoading: (isLoading: boolean, message?: string) => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showDraftRecoveryDialog: (step: number) => void;
  hideDraftRecoveryDialog: () => void;
  clearAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  loadingMessage: '',
  isModalVisible: false,
  modalContent: null,
  toasts: [],
  showDraftRecovery: false,
  savedStep: 0,

  setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),

  showModal: (content) => set({ isModalVisible: true, modalContent: content }),

  hideModal: () => set({ isModalVisible: false, modalContent: null }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Math.random().toString(36).substring(7),
          duration: toast.duration || 3000,
        },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  showDraftRecoveryDialog: (step) => set({ showDraftRecovery: true, savedStep: step }),

  hideDraftRecoveryDialog: () => set({ showDraftRecovery: false, savedStep: 0 }),

  clearAll: () =>
    set({
      isLoading: false,
      loadingMessage: '',
      isModalVisible: false,
      modalContent: null,
      toasts: [],
      showDraftRecovery: false,
      savedStep: 0,
    }),
}));
