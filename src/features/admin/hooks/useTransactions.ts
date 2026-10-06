import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { TransactionFilters } from '../types';

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'transactions', filters],
    queryFn: () => adminService.getTransactions(filters),
  });
}