// src/features/reviews/components/ReviewCard.tsx
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Calendar, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  showSpace?: boolean;
}

export function ReviewCard({ review, showSpace = true }: ReviewCardProps) {
  const date = new Date(review.review_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {review.customer_first_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {review.customer_first_name}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < review.rating
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Space (optional) */}
      {showSpace && review.space && (
        <Link
          to={`/spaces/${review.space.id}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Building2 className="size-3" />
          {review.space.name}
          <ArrowRight className="size-3" />
        </Link>
      )}

      {/* Comment */}
      {review.comment ? (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          "{review.comment}"
        </p>
      ) : (
        <p className="text-sm text-muted-foreground italic flex items-center gap-1.5">
          <MessageSquare className="size-3.5" />
          No comment provided
        </p>
      )}
    </motion.div>
  );
}