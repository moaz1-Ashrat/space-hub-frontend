import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { UserFilters } from '../types';

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminService.getUsers(filters),
  });
}