import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import { getErrorMessage } from '@/lib/errors';

export function useRejectSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.rejectSpace(id),
    onSuccess: () => {
      toast.success('Space rejected');
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}