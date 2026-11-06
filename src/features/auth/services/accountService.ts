// src/features/auth/services/accountService.ts
import apiClient from '@/lib/axios';

export const accountService = {
  async forgotPassword(payload: { email: string }) {
    const { data } = await apiClient.post('/auth/forgot-password', payload);
    return data;
  },

  async resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    const { data } = await apiClient.post('/auth/reset-password', payload);
    return data;
  },

  async updateProfile(payload: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    gender?: 'male' | 'female';
  }) {
    const { data } = await apiClient.put('/auth/profile', payload);
    return data;
  },

  async changePassword(payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) {
    const { data } = await apiClient.put('/auth/password', payload);
    return data;
  },
};