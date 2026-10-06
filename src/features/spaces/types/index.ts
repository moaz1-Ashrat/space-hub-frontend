// ============================================
// Space Feature
// ============================================
export interface SpaceFeature {
  id: number;
  name: string;
  category: string;
  description: string | null;
}

// ============================================
// Space Image
// ============================================
export interface SpaceImage {
  id: number;
  space_id: number;
  url: string;
  order: number;
  is_primary: boolean;
  created_at: string;
}

// ============================================
// Space
// ============================================
export interface Space {
  id: number;
  name: string;
  location: string;
  description: string | null;
  space_size: string;
  capacity_people: number;
  price_per_hour: string;
  space_type: string;
  device_type: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  owner_name: string;
  average_rating?: number;
  features: SpaceFeature[];
  images?: SpaceImage[];
  primary_image?: SpaceImage | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Filters
// ============================================
export interface SpaceFilters {
  type?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
  capacity?: number;
  page?: number;
}

// ============================================
// Paginated Response
// ============================================
export interface PaginatedSpaces {
  data: Space[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}