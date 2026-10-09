// src/features/admin/hooks/useUserDetail.ts
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export function useUserDetail(id: number) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminService.getUserDetail(id),
    enabled: !!id,
  });
}