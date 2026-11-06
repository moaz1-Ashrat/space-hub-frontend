import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';

export function useDeleteCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
}
