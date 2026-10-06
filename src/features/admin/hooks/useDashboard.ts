import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
  });
}