import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingService } from '../services/bookingService';
import { getErrorMessage } from '@/lib/errors';
import type { CreateBookingPayload } from '../types';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingService.create(payload),
    onSuccess: () => {
      toast.success('Booking created successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}