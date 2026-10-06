import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import { getErrorMessage } from '@/lib/errors';

export function useApproveSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.approveSpace(id),
    onSuccess: () => {
      toast.success('Space approved');
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}