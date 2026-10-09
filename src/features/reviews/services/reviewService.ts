// src/features/reviews/services/reviewService.ts
import apiClient from '@/lib/axios';
import type { PaginatedReviews, Review } from '../types';

interface CreateReviewPayload {
  space_id: number;
  rating: number;
  comment?: string;
}

export const reviewService = {
  /**
   * Get authenticated customer's own reviews
   * Endpoint: GET /reviews/me
   */
  async myReviews(page = 1): Promise<PaginatedReviews> {
    const { data } = await apiClient.get<PaginatedReviews>('/reviews/me', {
      params: { page },
    });
    return data;
  },

  /**
   * Get reviews for a specific space
   * Endpoint: GET /spaces/{spaceId}/reviews
   */
  async bySpace(spaceId: number, page = 1): Promise<PaginatedReviews> {
    const { data } = await apiClient.get<PaginatedReviews>(
      `/spaces/${spaceId}/reviews`,
      { params: { page } }
    );
    return data;
  },

  /**
   * Create a new review
   * Endpoint: POST /reviews
   */
  async create(payload: CreateReviewPayload): Promise<{ data: Review }> {
    const { data } = await apiClient.post<{ data: Review }>(
      '/reviews',
      payload
    );
    return data;
  },
};