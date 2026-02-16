import { apiClient } from './client';

export interface PhoneLoginRequest {
  phone: string;
}

export interface OTPVerifyRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    phone: string;
    name: string | null;
    role: string;
    is_active: boolean;
  };
}

export const authApi = {
  requestOtp: async (data: PhoneLoginRequest) => {
    const response = await apiClient.post('/auth/login/otp', data);
    return response.data;
  },
  verifyOtp: async (data: OTPVerifyRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
};
