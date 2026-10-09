// src/features/reviews/types/index.ts

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  review_date: string;
  customer_first_name: string;
  created_at?: string;

  // Relations (تُرسل من Backend حسب الحاجة)
  space?: {
    id: number;
    name: string;
    location?: string;
    primary_image?: {
      id: number;
      url: string;
    } | null;
  };
  customer?: {
    id: number;
    name: string;
  };
}

export interface PaginatedReviews {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}