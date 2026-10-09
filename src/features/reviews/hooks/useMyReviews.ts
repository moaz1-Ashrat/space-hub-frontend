// src/features/reviews/hooks/useMyReviews.ts
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';

export function useMyReviews(page = 1) {
  return useQuery({
    queryKey: ['reviews', 'me', page],
    queryFn: () => reviewService.myReviews(page),
  });
}