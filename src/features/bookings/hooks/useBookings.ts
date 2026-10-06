import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';

export function useBookings(page = 1) {
  return useQuery({
    queryKey: ['bookings', 'customer', page],
    queryFn: () => bookingService.customerList(page),
  });
}