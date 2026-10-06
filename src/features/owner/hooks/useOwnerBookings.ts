import { useQuery } from '@tanstack/react-query';
import { ownerService } from '../services/ownerService';

export function useOwnerBookings(page = 1) {
  return useQuery({
    queryKey: ['owner', 'bookings', page],
    queryFn: () => ownerService.bookings(page),
  });
}