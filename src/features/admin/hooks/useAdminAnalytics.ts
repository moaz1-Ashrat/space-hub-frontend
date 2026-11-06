// src/features/admin/hooks/useAdminAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'summary'],
    queryFn: () => adminService.getAnalyticsSummary(),
  });
}

export function useAnalyticsRevenue(months = 6) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'revenue', months],
    queryFn: () => adminService.getAnalyticsRevenue(months),
  });
}

export function useAnalyticsGrowth() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'growth'],
    queryFn: () => adminService.getAnalyticsGrowth(),
  });
}

export function useAnalyticsDistribution() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'distribution'],
    queryFn: () => adminService.getAnalyticsDistribution(),
  });
}

export function useAnalyticsTopSpaces(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'top-spaces', limit],
    queryFn: () => adminService.getAnalyticsTopSpaces(limit),
  });
}

export function useAnalyticsTopOwners(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'top-owners', limit],
    queryFn: () => adminService.getAnalyticsTopOwners(limit),
  });
}

export function useAnalyticsTopCustomers(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'top-customers', limit],
    queryFn: () => adminService.getAnalyticsTopCustomers(limit),
  });
}

// ============================================
// Demographics
// ============================================
export function useAnalyticsDemographics() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'demographics'],
    queryFn: () => adminService.getAnalyticsDemographics(),
  });
}

// ============================================
// Coupons Analytics
// ============================================
export function useAnalyticsCoupons() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'coupons'],
    queryFn: () => adminService.getAnalyticsCoupons(),
  });
}