import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '@/stores/authStore';
import type {
  LoginCredentials,
  RegisterCustomerPayload,
  RegisterOwnerPayload,
  UserRole,
} from '@/types';

/**
 * Maps role → dashboard path
 */
function getDashboardPath(role: UserRole): string {
  const map: Record<UserRole, string> = {
    customer: '/customer',
    space_owner: '/owner',
    admin: '/admin',
  };
  return map[role];
}

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // ============================================
  // Login
  // ============================================
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      setAuth(response.data, response.profile, response.token);
      navigate(getDashboardPath(response.data.role));
    },
  });

  // ============================================
  // Register Customer
  // ============================================
  const registerCustomerMutation = useMutation({
    mutationFn: (
      payload: Omit<RegisterCustomerPayload, 'role'>
    ) => authService.registerCustomer(payload),
    onSuccess: (response) => {
      setAuth(response.data, response.profile, response.token);
      navigate('/customer');
    },
  });

  // ============================================
  // Register Owner
  // ============================================
  const registerOwnerMutation = useMutation({
    mutationFn: (
      payload: Omit<RegisterOwnerPayload, 'role'>
    ) => authService.registerOwner(payload),
    onSuccess: (response) => {
      setAuth(response.data, response.profile, response.token);
      navigate('/owner');
    },
  });

  // ============================================
  // Logout
  // ============================================
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // Even if backend fails, clear locally
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  return {
    login: loginMutation,
    registerCustomer: registerCustomerMutation,
    registerOwner: registerOwnerMutation,
    logout: logoutMutation,
  };
}