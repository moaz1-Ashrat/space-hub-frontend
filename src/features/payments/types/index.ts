export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentBooking {
  id: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: string;
}

export interface Payment {
  id: number;
  amount: string;
  payment_methode: string | null;
  payment_status: PaymentStatus;
  payment_date_time: string | null;
  booking: PaymentBooking | null;
  created_at: string;
}

export interface PaymentsPaginated {
  data: Payment[];
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

export interface CheckoutPayload {
  payment_id: number;
  payment_method: 'manual' | 'card';
}

export interface CheckoutResponse {
  data: Payment & {
    booking?: PaymentBooking;
  };
}