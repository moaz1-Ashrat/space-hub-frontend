import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

export function useBooking(id: number) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.show(id),
    enabled: !!id,
  });
}