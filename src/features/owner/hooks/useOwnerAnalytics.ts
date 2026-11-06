// src/features/owner/hooks/useOwnerAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { ownerService } from '../services/ownerService';

export function useOwnerAnalyticsSummary() {
  return useQuery({
    queryKey: ['owner', 'analytics', 'summary'],
    queryFn: () => ownerService.getAnalyticsSummary(),
  });
}

export function useOwnerAnalyticsRevenue(months = 6) {
  return useQuery({
    queryKey: ['owner', 'analytics', 'revenue', months],
    queryFn: () => ownerService.getAnalyticsRevenue(months),
  });
}

export function useOwnerAnalyticsTopSpaces(limit = 5) {
  return useQuery({
    queryKey: ['owner', 'analytics', 'top-spaces', limit],
    queryFn: () => ownerService.getAnalyticsTopSpaces(limit),
  });
}

export function useOwnerAnalyticsPopularDays() {
  return useQuery({
    queryKey: ['owner', 'analytics', 'popular-days'],
    queryFn: () => ownerService.getAnalyticsPopularDays(),
  });
}

export function useOwnerAnalyticsDistribution() {
  return useQuery({
    queryKey: ['owner', 'analytics', 'distribution'],
    queryFn: () => ownerService.getAnalyticsDistribution(),
  });
}