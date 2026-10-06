import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';
import type { UpdateSpacePayload } from '../types';

interface UpdateArgs {
  id: number;
  payload: UpdateSpacePayload;
}

export function useUpdateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateArgs) =>
      ownerService.updateSpace(id, payload),
    onSuccess: (_, variables) => {
      toast.success('Space updated successfully');
      queryClient.invalidateQueries({ queryKey: ['owner', 'spaces'] });
      queryClient.invalidateQueries({ queryKey: ['space', variables.id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}