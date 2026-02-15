import { PropertyType } from '@propflow/types';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PropertyDraft {
  property_id?: string;
  property_type?: PropertyType;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  area_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  age?: number;
  lat?: number;
  lng?: number;
  photos?: string[];
}

export interface PhotoItem {
  id: string;
  uri: string;
  type: string;
  uploaded?: boolean;
}

interface PropertyStore {
  draft: PropertyDraft;
  photos: PhotoItem[];
  currentStep: number;
  isLoading: boolean;
  lastSaved: Date | null;

  setDraft: (data: Partial<PropertyDraft>) => void;
  addPhoto: (photo: PhotoItem) => void;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, data: Partial<PhotoItem>) => void;
  setCurrentStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<boolean>;
  resetDraft: () => void;
}

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

const STORAGE_KEY = 'propflow_property_draft';

export const usePropertyStore = create<PropertyStore>((set, get) => {
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  const startAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
    autoSaveTimer = setInterval(() => {
      get().saveDraft();
    }, AUTO_SAVE_INTERVAL);
  };

  const stopAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  };

  return {
    draft: {},
    photos: [],
    currentStep: 0,
    isLoading: false,
    lastSaved: null,

    setDraft: (data) => {
      set((state) => ({
        draft: { ...state.draft, ...data },
      }));
    },

    addPhoto: (photo) => {
      set((state) => ({
        photos: [...state.photos, photo],
      }));
      get().saveDraft();
    },

    removePhoto: (id) => {
      set((state) => ({
        photos: state.photos.filter((p) => p.id !== id),
      }));
      get().saveDraft();
    },

    updatePhoto: (id, data) => {
      set((state) => ({
        photos: state.photos.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    },

    setCurrentStep: (step) => {
      set({ currentStep: step });
      if (step > 0) {
        startAutoSave();
      } else {
        stopAutoSave();
      }
    },

    saveDraft: async () => {
      const { draft, photos, currentStep } = get();

      if (Object.keys(draft).length === 0 && photos.length === 0) {
        return;
      }

      try {
        set({ isLoading: true });

        const dataToSave = {
          draft,
          photos,
          currentStep,
          savedAt: new Date().toISOString(),
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

        set({
          lastSaved: new Date(),
          isLoading: false,
        });

        console.log('Property draft auto-saved:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to save draft:', error);
        set({ isLoading: false });
      }
    },

    loadDraft: async () => {
      try {
        set({ isLoading: true });

        const savedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedData) {
          const parsed = JSON.parse(savedData);

          set({
            draft: parsed.draft || {},
            photos: parsed.photos || [],
            currentStep: parsed.currentStep || 0,
            lastSaved: parsed.savedAt ? new Date(parsed.savedAt) : null,
            isLoading: false,
          });

          if (parsed.currentStep > 0) {
            startAutoSave();
          }

          console.log('Property draft loaded');
          return true;
        }

        set({ isLoading: false });
        return false;
      } catch (error) {
        console.error('Failed to load draft:', error);
        set({ isLoading: false });
        return false;
      }
    },

    resetDraft: () => {
      stopAutoSave();
      set({
        draft: {},
        photos: [],
        currentStep: 0,
        lastSaved: null,
      });
      AsyncStorage.removeItem(STORAGE_KEY);
    },
  };
});
