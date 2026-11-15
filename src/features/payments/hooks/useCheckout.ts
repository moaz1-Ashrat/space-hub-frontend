import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentService } from '../services/paymentService';
import { getErrorMessage } from '@/lib/errors';

export function useCheckout() {
  return useMutation({
    mutationFn: (paymentId: number) => paymentService.initiateKashier(paymentId),
    onSuccess: (data) => {
      // توجيه المستخدم لصفحة الدفع الحقيقية في Kashier
      window.location.href = data.url;
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to initiate payment.');
    },
  });
}