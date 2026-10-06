import { useQuery } from '@tanstack/react-query';
import { spaceService } from '../services/spaceService';

export function useSpace(id: number) {
  return useQuery({
    queryKey: ['space', id],
    queryFn: () => spaceService.show(id),
    enabled: !!id,
  });
}