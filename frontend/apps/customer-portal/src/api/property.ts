import { PropertyType } from '@propflow/types';
import { apiClient } from './client';

export interface Property {
  id: string;
  property_type: PropertyType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  estimated_value?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'VALUED' | 'REJECTED' | 'FOLLOW_UP';
  created_at: string;
  updated_at?: string;
  user_id: string;
}

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

export const propertyApi = {
  createProperty: async (payload: CreatePropertyRequest): Promise<PropertyResponse> => {
    const response = await apiClient.post('/properties/', payload);
    return response.data;
  },

  uploadPhoto: async (propertyId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await apiClient.post(`/properties/${propertyId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  submitProperty: async (propertyId: string): Promise<void> => {
    await apiClient.post(`/properties/${propertyId}/submit`);
  },

  getProperty: async (propertyId: string): Promise<Property> => {
    const response = await apiClient.get<Property>(`/properties/${propertyId}`);
    return response.data;
  },

  getProperties: async (params?: { skip?: number; limit?: number }): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>('/properties/', { params });
    return response.data;
  },

  getPhotos: async (propertyId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/properties/${propertyId}/photos`);
    return response.data;
  },
};
