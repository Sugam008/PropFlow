import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PropertyType } from '@propflow/types';
import { propertyApi, CreatePropertyRequest } from '../api/property';

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
  file?: File;
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
  resetDraft: () => void;
  submitValuation: () => Promise<string>;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      draft: {},
      photos: [],
      currentStep: 0,
      isLoading: false,
      lastSaved: null,

      setDraft: (data) => {
        set((state) => ({
          draft: { ...state.draft, ...data },
          lastSaved: new Date(),
        }));
      },

      addPhoto: (photo) => {
        set((state) => ({
          photos: [...state.photos, photo],
          lastSaved: new Date(),
        }));
      },

      removePhoto: (id) => {
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
          lastSaved: new Date(),
        }));
      },

      updatePhoto: (id, data) => {
        set((state) => ({
          photos: state.photos.map((p) => (p.id === id ? { ...p, ...data } : p)),
          lastSaved: new Date(),
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      resetDraft: () => {
        set({
          draft: {},
          photos: [],
          currentStep: 0,
          lastSaved: null,
        });
      },

      submitValuation: async () => {
        set({ isLoading: true });
        try {
          const { draft, photos } = get();

          if (
            !draft.property_type ||
            !draft.address ||
            !draft.city ||
            !draft.state ||
            !draft.pincode ||
            !draft.area_sqft
          ) {
            throw new Error('Missing required fields');
          }

          const payload: CreatePropertyRequest = {
            property_type: draft.property_type,
            address: draft.address,
            city: draft.city,
            state: draft.state,
            pincode: draft.pincode,
            lat: draft.lat,
            lng: draft.lng,
            area_sqft: draft.area_sqft,
            bedrooms: draft.bedrooms,
            bathrooms: draft.bathrooms,
            floor: draft.floor,
            total_floors: draft.total_floors,
            age: draft.age,
            description: 'Valuation Request',
          };

          const response = await propertyApi.createProperty(payload);
          const propertyId = response.id;

          // Upload photos
          for (const photo of photos) {
            if (photo.file) {
              await propertyApi.uploadPhoto(propertyId, photo.file);
            }
          }

          // Submit property
          await propertyApi.submitProperty(propertyId);

          set({ isLoading: false });
          return propertyId;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'propflow-property-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draft: state.draft,
        photos: state.photos.map((p) => {
          const { file, ...rest } = p;
          return rest;
        }),
        currentStep: state.currentStep,
        lastSaved: state.lastSaved,
      }),
    },
  ),
);
