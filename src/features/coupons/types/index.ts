export interface Coupon {
  id: number;
  code: string;
  user_id: number | null;
  discount_value: number;
  commission_rate: number | null;
  is_used: boolean;
  expiry_date: string | null;
  used_at: string | null;
  booking_id: number | null;
  created_at: string;
}
