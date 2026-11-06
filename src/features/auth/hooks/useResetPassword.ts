import { useMutation } from '@tanstack/react-query';
import { accountService } from '../services/accountService';

export function useResetPassword() {
  return useMutation({
    mutationFn: accountService.resetPassword,
  });
}