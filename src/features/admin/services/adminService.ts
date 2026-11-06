import apiClient from '@/lib/axios';
import type { Space } from '@/features/spaces/types';
import type {
  AdminUser,
  AdminUsersPaginated,
  UserFilters,
  TransactionsPaginated,
  TransactionFilters,
  DashboardStats,
  PendingSpacesPaginated,
  SpaceFilters,
  AllSpacesPaginated,
  AdminUserDetail,
  AnalyticsSummary,
  AnalyticsRevenue,
  AnalyticsGrowth,
  AnalyticsDistribution,
  TopSpace,
  TopOwner,
  TopCustomer,
  AdminCoupon,
  AdminCouponsPaginated,
  CouponFilters,
  CreateCouponPayload,
  UpdateCouponPayload,
} from '../types';

export const adminService = {
  // ============================================
  // USERS
  // ============================================
  async getUsers(filters: UserFilters = {}): Promise<AdminUsersPaginated> {
    const { data } = await apiClient.get<AdminUsersPaginated>('/admin/users', {
      params: filters,
    });
    return data;
  },

  async suspendUser(id: number): Promise<{ data: AdminUser }> {
    const { data } = await apiClient.put<{ data: AdminUser }>(
      '/admin/users/' + id + '/suspend'
    );
    return data;
  },

  async activateUser(id: number): Promise<{ data: AdminUser }> {
    const { data } = await apiClient.put<{ data: AdminUser }>(
      '/admin/users/' + id + '/activate'
    );
    return data;
  },

  // ============================================
  // SPACES
  // ============================================
  async getPendingSpaces(page = 1): Promise<PendingSpacesPaginated> {
    const { data } = await apiClient.get<PendingSpacesPaginated>(
      '/admin/spaces/pending',
      { params: { page } }
    );
    return data;
  },

  async approveSpace(id: number): Promise<{ data: Space }> {
    const { data } = await apiClient.put<{ data: Space }>(
      '/admin/spaces/' + id + '/approve'
    );
    return data;
  },

  async rejectSpace(id: number): Promise<{ data: Space }> {
    const { data } = await apiClient.put<{ data: Space }>(
      '/admin/spaces/' + id + '/reject'
    );
    return data;
  },

  // ============================================
  // TRANSACTIONS
  // ============================================
  async getTransactions(
    filters: TransactionFilters = {}
  ): Promise<TransactionsPaginated> {
    const { data } = await apiClient.get<TransactionsPaginated>(
      '/admin/transactions',
      { params: filters }
    );
    return data;
  },

  // ============================================
  // DASHBOARD
  // ============================================
  async getDashboard(): Promise<{ data: DashboardStats }> {
    const { data } = await apiClient.get<{ data: DashboardStats }>(
      '/admin/dashboard'
    );
    return data;
  },

  // ============================================
  // ALL SPACES (Admin)
  // ============================================
  async getAllSpaces(filters: SpaceFilters = {}): Promise<AllSpacesPaginated> {
    const { data } = await apiClient.get<AllSpacesPaginated>(
      '/admin/spaces',
      { params: filters }
    );
    return data;
  },

  // ============================================
  // USER DETAIL (Admin)
  // ============================================
  async getUserDetail(id: number): Promise<{ data: AdminUserDetail }> {
    const { data } = await apiClient.get<{ data: AdminUserDetail }>(
      '/admin/users/' + id
    );
    return data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  async getAnalyticsSummary(): Promise<{ data: AnalyticsSummary }> {
    const { data } = await apiClient.get<{ data: AnalyticsSummary }>(
      '/admin/analytics/summary'
    );
    return data;
  },

  async getAnalyticsRevenue(months = 6): Promise<{ data: AnalyticsRevenue }> {
    const { data } = await apiClient.get<{ data: AnalyticsRevenue }>(
      '/admin/analytics/revenue',
      { params: { months } }
    );
    return data;
  },

  async getAnalyticsGrowth(): Promise<{ data: AnalyticsGrowth }> {
    const { data } = await apiClient.get<{ data: AnalyticsGrowth }>(
      '/admin/analytics/growth'
    );
    return data;
  },

  async getAnalyticsDistribution(): Promise<{ data: AnalyticsDistribution }> {
    const { data } = await apiClient.get<{ data: AnalyticsDistribution }>(
      '/admin/analytics/distribution'
    );
    return data;
  },

  async getAnalyticsTopSpaces(limit = 10): Promise<{ data: TopSpace[] }> {
    const { data } = await apiClient.get<{ data: TopSpace[] }>(
      '/admin/analytics/top-spaces',
      { params: { limit } }
    );
    return data;
  },

  async getAnalyticsTopOwners(limit = 10): Promise<{ data: TopOwner[] }> {
    const { data } = await apiClient.get<{ data: TopOwner[] }>(
      '/admin/analytics/top-owners',
      { params: { limit } }
    );
    return data;
  },

  async getAnalyticsTopCustomers(limit = 10): Promise<{ data: TopCustomer[] }> {
    const { data } = await apiClient.get<{ data: TopCustomer[] }>(
      '/admin/analytics/top-customers',
      { params: { limit } }
    );
    return data;
  },

  // ============================================
  // COUPONS (Admin)
  // ============================================
  async getCoupons(filters: CouponFilters = {}): Promise<AdminCouponsPaginated> {
    const { data } = await apiClient.get<AdminCouponsPaginated>(
      '/admin/coupons',
      { params: filters }
    );
    return data;
  },

  async createCoupon(
    payload: CreateCouponPayload
  ): Promise<{ data: AdminCoupon; message: string }> {
    const { data } = await apiClient.post<{
      data: AdminCoupon;
      message: string;
    }>('/admin/coupons', payload);
    return data;
  },

  async updateCoupon(
    id: number,
    payload: UpdateCouponPayload
  ): Promise<{ data: AdminCoupon; message: string }> {
    const { data } = await apiClient.put<{
      data: AdminCoupon;
      message: string;
    }>('/admin/coupons/' + id, payload);
    return data;
  },

  async deleteCoupon(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      '/admin/coupons/' + id
    );
    return data;
  },

  // ============================================
  // ANALYTICS — Demographics & Coupons
  // ============================================
  async getAnalyticsDemographics(): Promise<{ data: AnalyticsDemographics }> {
    const { data } = await apiClient.get<{ data: AnalyticsDemographics }>(
      '/admin/analytics/demographics'
    );
    return data;
  },

  async getAnalyticsCoupons(): Promise<{ data: AnalyticsCoupons }> {
    const { data } = await apiClient.get<{ data: AnalyticsCoupons }>(
      '/admin/analytics/coupons'
    );
    return data;
  },
};
