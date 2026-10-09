// src/features/owner/hooks/useSpaceAvailability.ts
import { useQuery } from '@tanstack/react-query';
import { ownerService } from '../services/ownerService';

export function useSpaceAvailability(spaceId: number) {
  return useQuery({
    queryKey: ['owner', 'availability', spaceId],
    queryFn: () => ownerService.spaceAvailability(spaceId),
    enabled: !!spaceId,
  });
}