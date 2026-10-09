// src/features/owner/hooks/useUpdateAvailability.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import type { AvailabilityPayload } from '../types';

export function useUpdateAvailability(spaceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<AvailabilityPayload>;
    }) => ownerService.updateAvailability(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['owner', 'availability', spaceId] });
      toast.success('Availability updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update');
    },
  });
}