import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { CouponFilters } from '../types';

export function useAdminCoupons(filters: CouponFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'coupons', filters],
    queryFn: () => adminService.getCoupons(filters),
  });
}
