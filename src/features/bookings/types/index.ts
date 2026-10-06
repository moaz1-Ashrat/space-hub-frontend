export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface BookingSpace {
  id: number;
  name: string;
}

export interface BookingPayment {
  id: number;
  amount: number;
  payment_status: PaymentStatus;
}

export interface Booking {
  id: number;
  space: BookingSpace;
  start_datetime: string;
  end_datetime: string;
  total_amount: number;
  customer_paid: number;
  payment: BookingPayment | null;
  booking_status: BookingStatus;
  created_at: string;
  // Owner/Admin only
  commission_rate?: number;
  commission_amount?: number;
  owner_payout?: number;
}

export interface BookingsPaginated {
  data: Booking[];
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

export interface CreateBookingPayload {
  space_id: number;
  start_datetime: string;
  end_datetime: string;
  coupon_id?: number;
}