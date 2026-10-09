// src/features/reviews/components/EmptyReviews.tsx
import { Star, MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from 'react-i18next';

interface EmptyReviewsProps {
  variant?: 'space' | 'mine';
}

export function EmptyReviews({ variant = 'space' }: EmptyReviewsProps) {
  const { t } = useTranslation();

  if (variant === 'mine') {
    return (
      <EmptyState
        icon={Star}
        title={t('reviews.empty.mine.title', 'No reviews yet')}
        description={t(
          'reviews.empty.mine.description',
          "You haven't reviewed any spaces yet. Complete a booking and share your experience!"
        )}
        actionLabel={t('reviews.empty.mine.action', 'My Bookings')}
        actionHref="/customer/bookings"
      />
    );
  }

  return (
    <EmptyState
      icon={MessageSquare}
      title={t('reviews.empty.space.title', 'No reviews yet')}
      description={t(
        'reviews.empty.space.description',
        'Be the first to review this space after your booking!'
      )}
    />
  );
}