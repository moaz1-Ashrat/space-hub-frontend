// src/features/owner/hooks/useDeleteAvailability.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';

export function useDeleteAvailability(spaceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ownerService.deleteAvailability(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['owner', 'availability', spaceId] });
      toast.success('Availability deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete');
    },
  });
}