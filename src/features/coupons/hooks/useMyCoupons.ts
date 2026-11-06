import { useQuery } from '@tanstack/react-query';
import { couponService } from '../services/couponService';

export function useMyCoupons() {
  return useQuery({
    queryKey: ['coupons', 'my'],
    queryFn: () => couponService.myCoupons(),
  });
}
