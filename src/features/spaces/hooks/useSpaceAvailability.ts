// src/features/spaces/hooks/useSpaceAvailability.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { Availability } from '@/features/owner/types';

export function useSpaceAvailability(spaceId: number) {
  return useQuery({
    queryKey: ['space-availability', spaceId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Availability[] }>(
        `/spaces/${spaceId}/availability`
      );
      return data;
    },
    enabled: !!spaceId,
  });
}