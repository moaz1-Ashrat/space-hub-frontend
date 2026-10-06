import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingService } from '../services/bookingService';
import { getErrorMessage } from '@/lib/errors';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingService.cancel(id),
    onSuccess: (_, id) => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}