// src/features/bookings/pages/MyBookingsPage.tsx
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useBookings } from '../hooks/useBookings';
import { BookingCard } from '../components/BookingCard';
import { BookingListSkeleton } from '../components/BookingCardSkeleton';
import { EmptyBookings } from '../components/EmptyBookings';
import { Button } from '@/components/ui/button';
import type { BookingStatus } from '../types';
import { staggerContainer, staggerItem } from '@/lib/animations';

type FilterStatus = BookingStatus | 'all';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function MyBookingsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { data, isLoading, isError, refetch } = useBookings(page);

  const filteredBookings =
    data?.data.filter((b) => filter === 'all' || b.booking_status === filter) ??
    [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">
          {t('bookings.my.title', 'My Bookings')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('bookings.my.subtitle', 'Track and manage all your space bookings')}
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {t(`bookings.status.${f.value}`, f.label)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && <BookingListSkeleton count={4} />}

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
            {t('bookings.error.title', 'Failed to load bookings')}
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t('bookings.error.description', 'Something went wrong. Please try again.')}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {t('common.retry', 'Try Again')}
          </Button>
        </motion.div>
      )}

      {/* Empty - All */}
      {data && filteredBookings.length === 0 && filter === 'all' && (
        <EmptyBookings variant="customer" />
      )}

      {/* Empty - Filtered */}
      {data && filteredBookings.length === 0 && filter !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center bg-card border border-border rounded-xl"
        >
          <p className="text-lg font-medium">
            {t('bookings.empty.filtered.title', 'No {{status}} bookings', {
              status: filter,
            })}
          </p>
          <p className="text-muted-foreground mt-1 mb-4">
            {t('bookings.empty.filtered.description', 'Try a different filter')}
          </p>
          <Button variant="outline" onClick={() => setFilter('all')}>
            {t('bookings.empty.filtered.action', 'Show All Bookings')}
          </Button>
        </motion.div>
      )}

      {/* Data */}
      {data && filteredBookings.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-3"
          >
            {filteredBookings.map((booking) => (
              <motion.div key={booking.id} variants={staggerItem}>
                <BookingCard booking={booking} />
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