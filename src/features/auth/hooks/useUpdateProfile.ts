import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: accountService.updateProfile,
    onSuccess: (data) => {
      // Update auth store with new user data
      useAuthStore.setState({ user: data.data as User });
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}