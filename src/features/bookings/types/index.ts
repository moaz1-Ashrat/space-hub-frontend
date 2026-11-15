export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface BookingSpace {
  id: number;
  name: string;
  location?: string;
  owner?: {
    name?: string;
    email?: string;
  };
}

export interface BookingPayment {
  id: number;
  amount: number;
  payment_status: PaymentStatus;
  payment_methode?: string | null;
  invoice_number?: string | null;
  gateway_transaction_id?: string | null;
}

export interface Booking {
  id: number;
  space: BookingSpace;
  start_datetime: string;
  end_datetime: string;
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  total_amount: number;
  customer_paid: number;
  payment: BookingPayment | null;
  booking_status: BookingStatus;
  attendance_status: 'pending' | 'attended' | 'no_show';
  qr_code?: string | null;
  is_third_party?: boolean;
  guest_name?: string | null;
  guest_phone?: string | null;
  created_at: string;
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
  coupon_code?: string;
  coupon_id?: number;
  is_third_party?: boolean;
  guest_name?: string;
  guest_phone?: string;
  attendee_name?: string;
  attendee_email?: string;
  attendee_phone?: string;
}