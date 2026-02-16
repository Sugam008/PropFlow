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
  area_sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  age?: number;
  description?: string;
  submitted_at?: string;
  reviewed_at?: string;
  valuer_notes?: string;
  valuer_id?: string;
  photos?: PropertyPhoto[];
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  s3_key: string;
  s3_url: string;
  photo_type: 'EXTERIOR' | 'INTERIOR' | 'DOCUMENT' | 'OTHER';
  sequence: number;
  captured_at?: string;
  gps_lat?: number;
  gps_lng?: number;
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

  deleteProperty: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/properties/${propertyId}`);
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

  geocodeAddress: async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await apiClient.post<{ lat: number; lng: number }>('/geocode/geocode', {
        address,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
