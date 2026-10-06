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
      `/admin/users/${id}/suspend`
    );
    return data;
  },

  async activateUser(id: number): Promise<{ data: AdminUser }> {
    const { data } = await apiClient.put<{ data: AdminUser }>(
      `/admin/users/${id}/activate`
    );
    return data;
  },

  // ============================================
  // SPACES
  // ============================================

  async getPendingSpaces(
    page = 1
  ): Promise<PendingSpacesPaginated> {
    const { data } = await apiClient.get<PendingSpacesPaginated>(
      '/admin/spaces/pending',
      { params: { page } }
    );
    return data;
  },

  async approveSpace(id: number): Promise<{ data: Space }> {
    const { data } = await apiClient.put<{ data: Space }>(
      `/admin/spaces/${id}/approve`
    );
    return data;
  },

  async rejectSpace(id: number): Promise<{ data: Space }> {
    const { data } = await apiClient.put<{ data: Space }>(
      `/admin/spaces/${id}/reject`
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
};