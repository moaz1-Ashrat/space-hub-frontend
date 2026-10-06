import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';

export function usePaymentHistory(page = 1) {
  return useQuery({
    queryKey: ['payments', 'history', page],
    queryFn: () => paymentService.history(page),
  });
}