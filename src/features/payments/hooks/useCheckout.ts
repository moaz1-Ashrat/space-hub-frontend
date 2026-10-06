import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import { getErrorMessage } from '@/lib/errors';
import type { CheckoutPayload } from '../types';

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => paymentService.checkout(payload),
    onSuccess: () => {
      toast.success('Payment completed successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}