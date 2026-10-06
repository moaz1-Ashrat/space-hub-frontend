import { useQuery } from '@tanstack/react-query';
import { spaceService } from '../services/spaceService';
import type { SpaceFilters } from '../types';

export function useSpaces(filters: SpaceFilters = {}) {
  return useQuery({
    queryKey: ['spaces', filters],
    queryFn: () => spaceService.list(filters),
  });
}