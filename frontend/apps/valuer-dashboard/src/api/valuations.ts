import { apiClient } from './client';

export interface ValuationCreate {
  property_id: string;
  estimated_value: number;
  confidence_score: number;
  valuation_date: string;
  notes?: string;
  methodology?: string;
  comp1_id?: string;
  comp2_id?: string;
  comp3_id?: string;
}

export const valuationApi = {
  createValuation: async (data: ValuationCreate) => {
    const response = await apiClient.post('/valuations/', data);
    return response.data;
  },
  
  getValuations: async (params?: { skip?: number; limit?: number }) => {
    const response = await apiClient.get('/valuations/', { params });
    return response.data;
  }
};
