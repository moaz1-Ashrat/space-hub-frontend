import apiClient from '@/lib/axios';
import type {
  Space,
  SpaceFilters,
  PaginatedSpaces,
  SpaceImage,
} from '../types';

export const spaceService = {
  // ============================================
  // Spaces
  // ============================================
  async list(filters: SpaceFilters = {}): Promise<PaginatedSpaces> {
    const { data } = await apiClient.get<PaginatedSpaces>('/spaces', {
      params: filters,
    });
    return data;
  },

  async show(id: number): Promise<{ data: Space }> {
    const { data } = await apiClient.get<{ data: Space }>(`/spaces/${id}`);
    return data;
  },

  // ============================================
  // Images
  // ============================================
  async uploadImage(
    spaceId: number,
    file: File,
    isPrimary = false
  ): Promise<{ data: SpaceImage }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('is_primary', isPrimary ? '1' : '0');

    const { data } = await apiClient.post<{ data: SpaceImage }>(
      `/spaces/${spaceId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  async deleteImage(imageId: number): Promise<void> {
    await apiClient.delete(`/spaces/images/${imageId}`);
  },

  async setPrimaryImage(imageId: number): Promise<{ data: SpaceImage }> {
    const { data } = await apiClient.put<{ data: SpaceImage }>(
      `/spaces/images/${imageId}/primary`
    );
    return data;
  },
};