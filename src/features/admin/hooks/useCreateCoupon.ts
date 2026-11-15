import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import type { CreateCouponPayload } from '../types';
import { getErrorMessage } from '@/lib/errors';

export function useCreateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCouponPayload) =>
      adminService.createCoupon(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon created successfully');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to create coupon');
    },
  });
}
