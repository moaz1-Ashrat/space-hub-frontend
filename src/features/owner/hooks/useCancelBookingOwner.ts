import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';

export function useCancelBookingOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ownerService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}