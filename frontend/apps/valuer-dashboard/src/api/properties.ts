import { apiClient } from './client';

export interface Property {
  id: string;
  property_type: string;
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

export const propertyApi = {
  getProperties: async (params?: { skip?: number; limit?: number }) => {
    const response = await apiClient.get<Property[]>('/properties/', { params });
    return response.data;
  },
  
  getProperty: async (id: string) => {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },

  getPhotos: async (propertyId: string) => {
    const response = await apiClient.get<any[]>(`/properties/${propertyId}/photos`);
    return response.data;
  },

  getComps: async (params?: { skip?: number; limit?: number }) => {
    const response = await apiClient.get<any[]>('/comps/', { params });
    return response.data;
  },

  requestFollowUp: async (id: string, notes: string) => {
    const response = await apiClient.patch<Property>(`/properties/${id}`, {
      status: 'FOLLOW_UP',
      valuer_notes: notes
    });
    return response.data;
  }
};


