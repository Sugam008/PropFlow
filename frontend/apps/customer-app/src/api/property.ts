import { PropertyType } from '@propflow/types';

import { apiClient } from './client';

export interface CreatePropertyRequest {
  property_type: PropertyType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  area_sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  age?: number;
  description?: string;
}

export interface PropertyResponse {
  id: string;
}

const guessMimeType = (uri: string): string => {
  const normalized = uri.toLowerCase();
  if (normalized.endsWith('.png')) {
    return 'image/png';
  }
  if (normalized.endsWith('.webp')) {
    return 'image/webp';
  }
  return 'image/jpeg';
};

export const propertyApi = {
  createProperty: async (payload: CreatePropertyRequest): Promise<PropertyResponse> => {
    const response = await apiClient.post('/properties/', payload);
    return response.data;
  },

  uploadPhoto: async (propertyId: string, uri: string, index: number): Promise<void> => {
    const formData = new FormData();
    const fileName = `photo-${index + 1}.jpg`;
    formData.append('file', {
      uri,
      name: fileName,
      type: guessMimeType(uri),
    } as unknown as Blob);

    await apiClient.post(`/properties/${propertyId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  submitProperty: async (propertyId: string): Promise<void> => {
    await apiClient.post(`/properties/${propertyId}/submit`);
  },

  getProperty: async (propertyId: string): Promise<any> => {
    const response = await apiClient.get(`/properties/${propertyId}`);
    return response.data;
  },
};
