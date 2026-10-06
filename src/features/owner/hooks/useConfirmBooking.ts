import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';

export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ownerService.confirmBooking(id),
    onSuccess: () => {
      toast.success('Booking confirmed');
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}