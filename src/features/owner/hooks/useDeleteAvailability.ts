// src/features/owner/hooks/useDeleteAvailability.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';

export function useDeleteAvailability(spaceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ownerService.deleteAvailability(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['owner', 'availability', spaceId] });
      toast.success('Availability deleted');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to delete');
    },
  });
}