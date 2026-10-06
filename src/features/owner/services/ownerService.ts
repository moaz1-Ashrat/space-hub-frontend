import apiClient from '@/lib/axios';
import type { Space, PaginatedSpaces } from '@/features/spaces/types';
import type { Booking, BookingsPaginated } from '@/features/bookings/types';
import type {
  CreateSpacePayload,
  UpdateSpacePayload,
  OwnerSpaceResponse,
} from '../types';

export const ownerService = {
  // ============================================
  // SPACES
  // ============================================

  /**
   * Get owner's spaces (all approval_status)
   */
  async mySpaces(): Promise<PaginatedSpaces> {
    const { data } = await apiClient.get<PaginatedSpaces>('/spaces/owner/me');
    return data;
  },

  /**
   * Get single space (for editing)
   */
  async showSpace(id: number): Promise<OwnerSpaceResponse> {
    const { data } = await apiClient.get<OwnerSpaceResponse>(`/spaces/${id}`);
    return data;
  },

  /**
   * Create new space
   */
  async createSpace(payload: CreateSpacePayload): Promise<OwnerSpaceResponse> {
    const { data } = await apiClient.post<OwnerSpaceResponse>(
      '/spaces',
      payload
    );
    return data;
  },

  /**
   * Update space
   */
  async updateSpace(
    id: number,
    payload: UpdateSpacePayload
  ): Promise<OwnerSpaceResponse> {
    const { data } = await apiClient.put<OwnerSpaceResponse>(
      `/spaces/${id}`,
      payload
    );
    return data;
  },

  /**
   * Delete space (soft delete)
   */
  async deleteSpace(id: number): Promise<void> {
    await apiClient.delete(`/spaces/${id}`);
  },

  // ============================================
  // BOOKINGS
  // ============================================

  /**
   * Get bookings across owner's spaces
   */
  async bookings(page = 1): Promise<BookingsPaginated> {
    const { data } = await apiClient.get<BookingsPaginated>(
      '/bookings/owner',
      { params: { page } }
    );
    return data;
  },

  /**
   * Confirm a booking
   */
  async confirmBooking(id: number): Promise<{ data: Booking }> {
    const { data } = await apiClient.put<{ data: Booking }>(
      `/bookings/${id}/confirm`
    );
    return data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(id: number): Promise<{ data: Booking }> {
    const { data } = await apiClient.put<{ data: Booking }>(
      `/bookings/${id}/cancel`
    );
    return data;
  },
};

export type { Space };