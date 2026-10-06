import apiClient from '@/lib/axios';
import type {
  Booking,
  BookingsPaginated,
  CreateBookingPayload,
} from '../types';

export const bookingService = {
  /**
   * Create a booking
   */
  async create(payload: CreateBookingPayload): Promise<{ data: Booking }> {
    const { data } = await apiClient.post<{ data: Booking }>(
      '/bookings',
      payload
    );
    return data;
  },

  /**
   * Get customer's bookings (paginated)
   */
  async customerList(page = 1): Promise<BookingsPaginated> {
    const { data } = await apiClient.get<BookingsPaginated>(
      '/bookings/customer',
      { params: { page } }
    );
    return data;
  },

  /**
   * Get single booking
   */
  async show(id: number): Promise<{ data: Booking }> {
    const { data } = await apiClient.get<{ data: Booking }>(`/bookings/${id}`);
    return data;
  },

  /**
   * Cancel booking
   */
  async cancel(id: number): Promise<{ data: Booking }> {
    const { data } = await apiClient.put<{ data: Booking }>(
      `/bookings/${id}/cancel`
    );
    return data;
  },
};