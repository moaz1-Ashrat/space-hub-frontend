import { useMutation } from '@tanstack/react-query';
import { accountService } from '../services/accountService';

export function useForgotPassword() {
  return useMutation({
    mutationFn: accountService.forgotPassword,
  });
}