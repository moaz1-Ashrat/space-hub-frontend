import { useQuery } from '@tanstack/react-query';
import { ownerService } from '../services/ownerService';

export function useOwnerSpaces() {
  return useQuery({
    queryKey: ['owner', 'spaces'],
    queryFn: () => ownerService.mySpaces(),
  });
}