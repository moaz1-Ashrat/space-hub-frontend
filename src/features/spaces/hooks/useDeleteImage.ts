import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { spaceService } from '../services/spaceService';
import { getErrorMessage } from '@/lib/errors';

interface DeleteArgs {
  imageId: number;
  spaceId: number;
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }: DeleteArgs) => spaceService.deleteImage(imageId),
    onSuccess: (_, variables) => {
      toast.success('Image deleted');

      // Invalidate جميع الـ caches المتأثرة
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