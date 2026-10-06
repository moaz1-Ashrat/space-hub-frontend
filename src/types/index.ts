// ============================================
// User Roles
// ============================================
export type UserRole = 'customer' | 'space_owner' | 'admin';

// ============================================
// User
// ============================================
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface CustomerProfile {
  id: number;
  favorite: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpaceOwnerProfile {
  id: number;
  tax_registration_number: string;
  tax_registration_number_display: string;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: number;
  level_of_authority: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  customer: CustomerProfile | null;
  space_owner: SpaceOwnerProfile | null;
  admin: AdminProfile | null;
}

// ============================================
// Auth
// ============================================
export interface AuthResponse {
  message: string;
  data: User;
  profile: UserProfile;
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCustomerPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'customer';
  favorite?: string;
}

export interface RegisterOwnerPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'owner';
  tax_registration_number: string;
}

export type RegisterPayload = RegisterCustomerPayload | RegisterOwnerPayload;

// ============================================
// API Errors
// ============================================
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Language & Theme
// ============================================
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
// ============================================
// Auth Forms
// ============================================
export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  password_confirmation: string;
}