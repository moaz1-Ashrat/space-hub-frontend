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
// ============================================
// All Spaces (Admin)
// ============================================
export interface SpaceFilters {
  approval_status?: 'pending' | 'approved' | 'rejected';
  space_type?: string;
  owner_id?: number;
  search?: string;
  page?: number;
}

export interface AdminSpace {
  id: number;
  name: string;
  location: string;
  space_type: string;
  price_per_hour: number;
  capacity_people: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  owner: {
    id: number;
    name: string;
    email: string;
  };
  primary_image: { id: number; url: string } | null;
  created_at: string;
}

export interface AllSpacesPaginated {
  data: AdminSpace[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  links: {
    prev: string | null;
    next: string | null;
  };
}

// ============================================
// User Detail (Admin)
// ============================================
export interface AdminUserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  gender: 'male' | 'female';
  created_at: string;

  // Role-specific data
  customer?: {
    favorite: string | null;
    total_bookings: number;
    total_spent: number;
    total_reviews: number;
  } | null;

  space_owner?: {
    tax_registration_number: string;
    total_spaces: number;
    approved_spaces: number;
    total_earnings: number;
  } | null;

  admin?: {
    level_of_authority: string;
  } | null;
}
// ============================================
// ANALYTICS
// ============================================
export interface AnalyticsSummary {
  total_users: number;
  total_customers: number;
  total_owners: number;
  total_admins: number;
  suspended_users: number;
  total_spaces: number;
  approved_spaces: number;
  pending_spaces: number;
  rejected_spaces: number;
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  avg_platform_rating: number;
}

export interface AnalyticsRevenue {
  labels: string[];
  revenue: number[];
  owner_payout: number[];
  platform_commission: number[];
  bookings_count: number[];
  unique_customers: number[];
}

export interface AnalyticsGrowth {
  users: { labels: string[]; counts: number[] };
  spaces: { labels: string[]; counts: number[] };
}

export interface AnalyticsDistribution {
  bookings: { labels: string[]; counts: number[] };
  space_types: { labels: string[]; counts: number[] };
}

export interface TopSpace {
  space_id: number;
  space_name: string;
  space_type: string;
  price_per_hour: number;
  approval_status: string;
  owner_id: number;
  total_bookings: number;
  successful_bookings: number;
  total_revenue: number;
  avg_rating: number;
  total_reviews: number;
}

export interface TopOwner {
  owner_id: number;
  owner_name: string;
  owner_email: string;
  total_spaces: number;
  total_bookings: number;
  total_earnings: number;
  avg_rating: number;
}

export interface TopCustomer {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  total_bookings: number;
  total_spent: number;
  total_reviews: number;
}
// ============================================
// COUPONS (Admin)
// ============================================

/** شكل الكوبون القادم من السيرفر */
interface AdminCouponBase {
  id: number;
  code: string;
  user_id: number | null;
  discount_value: number;
  commission_rate: number | null;
  expiry_date: string | null;
  created_at: string;
}

/** discriminated union: مستخدم vs غير مستخدم */
export type AdminCoupon =
  | (AdminCouponBase & {
      is_used: false;
      used_at: null;
      booking_id: null;
    })
  | (AdminCouponBase & {
      is_used: true;
      used_at: string;
      booking_id: number;
    });

export interface AdminCouponsPaginated {
  data: AdminCoupon[];
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

export interface CouponFilters {
  search?: string;
  code?: string;
  user_id?: number;
  is_used?: boolean;
  valid?: boolean;   // صالح للاستخدام (غير مستخدم + غير منتهي)
  expired?: boolean; // منتهي الصلاحية
  page?: number;
}

/** الباك إند هو اللي بيحدد is_used = false */
export interface CreateCouponPayload {
  code: string;
  user_id?: number | null;
  discount_value: number;
  commission_rate?: number | null;
  expiry_date?: string | null;
}

/** نفس الـ discriminated union */
export type UpdateCouponPayload = Partial<Pick<
  CreateCouponPayload,
  'code' | 'discount_value' | 'commission_rate' | 'expiry_date'
>>;

/** لو هتعمل صفحة إحصائيات */
export interface CouponsStats {
  total: number;
  used: number;
  available: number;
  expired: number;
  total_discount_given: number;
}

// ============================================
// ANALYTICS — Demographics
// ============================================
export interface AnalyticsDemographics {
  avg_age: number;
  by_role: Array<{ role: string; avg_age: number; count: number }>;
  by_gender: { labels: string[]; counts: number[] };
  age_distribution: { labels: string[]; counts: number[] };
}

// ============================================
// ANALYTICS — Coupons
// ============================================
export interface AnalyticsCoupons {
  totals: {
    total: number;
    used: number;
    available: number;
    expired: number;
    usage_rate: number;
    total_discount_given: number;
    revenue_with_coupons: number;
  };
  monthly_usage: {
    labels: string[];
    counts: number[];
    discounts: number[];
  };
  top_coupons: Array<{
    code: string;
    discount_value: number;
    used_at: string;
  }>;
}