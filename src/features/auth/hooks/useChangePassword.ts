import { useMutation } from '@tanstack/react-query';
import { accountService } from '../services/accountService';

export function useChangePassword() {
  return useMutation({
    mutationFn: accountService.changePassword,
  });
}