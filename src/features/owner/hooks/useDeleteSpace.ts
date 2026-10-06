import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ownerService } from '../services/ownerService';
import { getErrorMessage } from '@/lib/errors';

export function useDeleteSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ownerService.deleteSpace(id),
    onSuccess: () => {
      toast.success('Space deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['owner', 'spaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}