import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { spaceService } from '../services/spaceService';
import { getErrorMessage } from '@/lib/errors';

interface UploadArgs {
  spaceId: number;
  file: File;
  isPrimary?: boolean;
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, file, isPrimary }: UploadArgs) =>
      spaceService.uploadImage(spaceId, file, isPrimary),
    onSuccess: (_, variables) => {
      toast.success('Image uploaded successfully');
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