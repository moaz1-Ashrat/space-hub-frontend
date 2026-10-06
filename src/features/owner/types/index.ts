import type { Space } from '@/features/spaces/types';

export interface OwnerStats {
  totalSpaces: number;
  approvedSpaces: number;
  pendingSpaces: number;
  totalBookings: number;
  totalEarnings: number;
  pendingBookings: number;
}

export interface SpaceFormData {
  name: string;
  location: string;
  description: string;
  space_size: string;
  capacity_people: number;
  price_per_hour: number;
  space_type: string;
  device_type: string;
  feature_ids: number[];
}

export interface CreateSpacePayload extends SpaceFormData {}

export interface UpdateSpacePayload extends Partial<SpaceFormData> {}

export interface OwnerSpaceResponse {
  data: Space;
}

export type { Space };