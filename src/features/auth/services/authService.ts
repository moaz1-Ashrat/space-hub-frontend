import apiClient from '@/lib/axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCustomerPayload,
  RegisterOwnerPayload,
} from '@/types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return data;
  },

  /**
   * Register customer
   */
  async registerCustomer(
    payload: Omit<RegisterCustomerPayload, 'role'>
  ): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      ...payload,
      role: 'customer',
    });
    return data;
  },

  /**
   * Register owner
   */
  async registerOwner(
    payload: Omit<RegisterOwnerPayload, 'role'>
  ): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      ...payload,
      role: 'owner',
    });
    return data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current user
   */
  async me(): Promise<AuthResponse> {
    const { data } = await apiClient.get<AuthResponse>('/auth/me');
    return data;
  },

  /**
   * TODO: Forgot Password — Backend endpoint not implemented yet
   * POST /auth/forgot-password
   */
  async forgotPassword(_email: string): Promise<void> {
    // TODO: Wire to backend when endpoint exists
    throw new Error(
      'Forgot password endpoint is not implemented on the backend yet.'
    );
  },

  /**
   * TODO: Reset Password — Backend endpoint not implemented yet
   * POST /auth/reset-password
   */
  async resetPassword(_payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    // TODO: Wire to backend when endpoint exists
    throw new Error(
      'Reset password endpoint is not implemented on the backend yet.'
    );
  },
};