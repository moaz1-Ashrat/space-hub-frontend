import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';
import type { CreateSpacePayload } from '../types';

export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpacePayload) =>
      ownerService.createSpace(payload),
    onSuccess: () => {
      toast.success('Space created successfully');
      queryClient.invalidateQueries({ queryKey: ['owner', 'spaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}