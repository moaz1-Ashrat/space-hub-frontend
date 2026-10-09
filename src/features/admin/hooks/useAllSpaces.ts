// src/features/admin/hooks/useAllSpaces.ts
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { SpaceFilters } from '../types';

export function useAllSpaces(filters: SpaceFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'spaces', 'all', filters],
    queryFn: () => adminService.getAllSpaces(filters),
  });
}