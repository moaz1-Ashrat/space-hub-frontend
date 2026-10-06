import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export function usePendingSpaces(page = 1) {
  return useQuery({
    queryKey: ['admin', 'spaces', 'pending', page],
    queryFn: () => adminService.getPendingSpaces(page),
  });
}