import type { UserRole } from '@/types';
import type { Space } from '@/features/spaces/types';

// ============================================
// Admin User (from /admin/users)
// ============================================
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminUsersPaginated {
  data: AdminUser[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserFilters {
  role?: UserRole;
  is_active?: boolean;
  search?: string;
  page?: number;
}

// ============================================
// Admin Transactions
// ============================================
export interface AdminTransaction {
  id: number;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_methode: string | null;
  payment_date_time: string | null;
  booking_id: number | null;
  customer_name: string | null;
}

export interface TransactionsPaginated {
  data: AdminTransaction[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  status?: 'pending' | 'paid' | 'failed';
  user_id?: number;
  page?: number;
}

// ============================================
// Dashboard
// ============================================
export interface DashboardStats {
  total_users: number;
  total_customers: number;
  total_owners: number;
  total_spaces: number;
  pending_spaces: number;
  total_bookings: number;
  total_revenue: number;
}

// ============================================
// Pending Spaces (reuses Space type)
// ============================================
export interface PendingSpacesPaginated {
  data: Space[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    prev: string | null;
    next: string | null;
  };
}