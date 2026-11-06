import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { useAuthStore } from '@/stores/authStore';

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: accountService.updateProfile,
    onSuccess: (data) => {
      // Update auth store with new user data
      useAuthStore.setState({ user: data.data } as any);
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}