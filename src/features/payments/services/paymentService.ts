import apiClient from '@/lib/axios';
import type {
  CheckoutPayload,
  CheckoutResponse,
  PaymentsPaginated,
} from '../types';

export const paymentService = {
  /**
   * Checkout (manual or card)
   */
  async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const { data } = await apiClient.post<CheckoutResponse>(
      '/payments/checkout',
      payload
    );
    return data;
  },

  /**
   * Payment history (paginated)
   */
  async history(page = 1): Promise<PaymentsPaginated> {
    const { data } = await apiClient.get<PaymentsPaginated>(
      '/payments/history',
      { params: { page } }
    );
    return data;
  },
};