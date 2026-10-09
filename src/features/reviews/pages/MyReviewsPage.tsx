// src/features/reviews/pages/MyReviewsPage.tsx
import { useState } from 'react';
import { AlertCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useMyReviews } from '../hooks/useMyReviews';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewListSkeleton } from '../components/ReviewCardSkeleton';
import { EmptyReviews } from '../components/EmptyReviews';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function MyReviewsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMyReviews(page);

  const reviews = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Star className="size-7 text-warning fill-warning" />
            {t('reviews.my.title', 'My Reviews')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(
              'reviews.my.subtitle',
              'All the reviews you have shared with Space Hub'
            )}
          </p>
        </div>

        {data && data.meta.total > 0 && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.meta.total}{' '}
            {data.meta.total === 1 ? 'review' : 'reviews'}
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && <ReviewListSkeleton count={3} />}

      {/* Error */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">
            {t('reviews.error.title', 'Failed to load reviews')}
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t(
              'reviews.error.description',
              'Something went wrong. Please try again.'
            )}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {t('common.retry', 'Try Again')}
          </Button>
        </motion.div>
      )}

      {/* Empty */}
      {data && reviews.length === 0 && <EmptyReviews variant="mine" />}

      {/* Data */}
      {data && reviews.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {reviews.map((review) => (
              <motion.div key={review.id} variants={staggerItem}>
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </motion.div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                disabled={!data.links.prev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t('common.previous', 'Previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('common.page', 'Page')} {data.meta.current_page} /{' '}
                {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={!data.links.next}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('common.next', 'Next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}