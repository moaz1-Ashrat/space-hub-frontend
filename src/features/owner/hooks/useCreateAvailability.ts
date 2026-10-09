// src/features/owner/hooks/useCreateAvailability.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import type { AvailabilityPayload } from '../types';

export function useCreateAvailability(spaceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AvailabilityPayload) =>
      ownerService.createAvailability(spaceId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['owner', 'availability', spaceId] });
      toast.success('Availability slot added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add slot');
    },
  });
}