// src/features/owner/hooks/useCreateAvailability.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import type { AvailabilityPayload } from '../types';
import { getErrorMessage } from '@/lib/errors';

export function useCreateAvailability(spaceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AvailabilityPayload) =>
      ownerService.createAvailability(spaceId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['owner', 'availability', spaceId] });
      toast.success('Availability slot added');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to add slot');
    },
  });
}