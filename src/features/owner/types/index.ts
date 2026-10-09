// src/features/owner/types/index.ts
import type { Space } from '@/features/spaces/types';

// ============================================
// OWNER STATS
// ============================================
export interface OwnerStats {
  totalSpaces: number;
  approvedSpaces: number;
  pendingSpaces: number;
  totalBookings: number;
  totalEarnings: number;
  pendingBookings: number;
}

// ============================================
// SPACE FORM
// ============================================
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

// ============================================
// AVAILABILITY
// ============================================
export interface Availability {
  id: number;
  space_id: number;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  is_available: boolean;
  special_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilityPayload {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  special_date?: string | null;
}

export interface AvailabilityResponse {
  data: Availability;
}

export interface AvailabilityListResponse {
  data: Availability[];
}

// ============================================
// DAY NAME CONSTANTS
// ============================================
export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const DAY_NAMES_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

export type { Space };