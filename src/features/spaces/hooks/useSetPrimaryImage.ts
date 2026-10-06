import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { spaceService } from '../services/spaceService';
import { getErrorMessage } from '@/lib/errors';

interface SetPrimaryArgs {
  imageId: number;
  spaceId: number;
}

export function useSetPrimaryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }: SetPrimaryArgs) =>
      spaceService.setPrimaryImage(imageId),
    onSuccess: (_, variables) => {
      toast.success('Primary image updated');
      queryClient.invalidateQueries({ queryKey: ['space', variables.spaceId] });
      queryClient.invalidateQueries({
        queryKey: ['owner', 'space', variables.spaceId],
      });
      queryClient.invalidateQueries({ queryKey: ['owner', 'spaces'] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}