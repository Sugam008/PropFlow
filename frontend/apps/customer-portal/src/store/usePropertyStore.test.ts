import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePropertyStore } from './usePropertyStore';
import { propertyApi } from '../api/property';
import { PropertyType } from '@propflow/types';

// Mock the property API
vi.mock('../api/property', () => ({
  propertyApi: {
    createProperty: vi.fn(),
    uploadPhoto: vi.fn(),
    submitProperty: vi.fn(),
  },
}));

describe('usePropertyStore', () => {
  beforeEach(() => {
    // Reset store before each test
    usePropertyStore.getState().resetDraft();
    vi.clearAllMocks();
  });

  it('starts with initial state', () => {
    const state = usePropertyStore.getState();
    expect(state.draft).toEqual({});
    expect(state.photos).toEqual([]);
    expect(state.currentStep).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.lastSaved).toBeNull();
  });

  it('updates draft with setDraft', () => {
    const draftData = {
      property_type: PropertyType.APARTMENT,
      address: '123 Main St',
    };

    usePropertyStore.getState().setDraft(draftData);

    const state = usePropertyStore.getState();
    expect(state.draft.property_type).toBe(PropertyType.APARTMENT);
    expect(state.draft.address).toBe('123 Main St');
    expect(state.lastSaved).not.toBeNull();
  });

  it('adds a photo', () => {
    const photo = {
      id: 'photo_1',
      uri: 'file://photo_1.jpg',
      type: 'image/jpeg',
    };

    usePropertyStore.getState().addPhoto(photo);

    const state = usePropertyStore.getState();
    expect(state.photos).toHaveLength(1);
    expect(state.photos[0]).toEqual(photo);
    expect(state.lastSaved).not.toBeNull();
  });

  it('removes a photo', () => {
    const photo = {
      id: 'photo_1',
      uri: 'file://photo_1.jpg',
      type: 'image/jpeg',
    };

    usePropertyStore.getState().addPhoto(photo);
    usePropertyStore.getState().removePhoto('photo_1');

    const state = usePropertyStore.getState();
    expect(state.photos).toHaveLength(0);
  });

  it('updates current step', () => {
    usePropertyStore.getState().setCurrentStep(2);
    expect(usePropertyStore.getState().currentStep).toBe(2);
  });

  it('resets draft', () => {
    usePropertyStore.getState().setDraft({ address: 'Test' });
    usePropertyStore.getState().setCurrentStep(1);

    usePropertyStore.getState().resetDraft();

    const state = usePropertyStore.getState();
    expect(state.draft).toEqual({});
    expect(state.currentStep).toBe(0);
  });

  it('submits valuation successfully', async () => {
    const draftData = {
      property_type: PropertyType.APARTMENT,
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      area_sqft: 1000,
    };

    usePropertyStore.getState().setDraft(draftData);

    // Add a photo
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    usePropertyStore.getState().addPhoto({
      id: 'photo_1',
      uri: 'blob:test',
      type: 'image/jpeg',
      file: file,
    });

    (propertyApi.createProperty as any).mockResolvedValue({ id: 'prop_123' });
    (propertyApi.uploadPhoto as any).mockResolvedValue({ success: true });
    (propertyApi.submitProperty as any).mockResolvedValue({ success: true });

    const propertyId = await usePropertyStore.getState().submitValuation();

    expect(propertyId).toBe('prop_123');
    expect(propertyApi.createProperty).toHaveBeenCalled();
    expect(propertyApi.uploadPhoto).toHaveBeenCalled();
    expect(propertyApi.submitProperty).toHaveBeenCalledWith('prop_123');
    expect(usePropertyStore.getState().isLoading).toBe(false);
  });

  it('handles submission error', async () => {
    const draftData = {
      property_type: PropertyType.APARTMENT,
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      area_sqft: 1000,
    };

    usePropertyStore.getState().setDraft(draftData);

    (propertyApi.createProperty as any).mockRejectedValue(new Error('API Error'));

    await expect(usePropertyStore.getState().submitValuation()).rejects.toThrow('API Error');
    expect(usePropertyStore.getState().isLoading).toBe(false);
  });

  it('validates required fields before submission', async () => {
    usePropertyStore.getState().setDraft({
      address: '123 Main St',
      // Missing other required fields
    });

    await expect(usePropertyStore.getState().submitValuation()).rejects.toThrow(
      'Missing required fields',
    );
  });
});
