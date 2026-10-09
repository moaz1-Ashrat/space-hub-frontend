// src/features/owner/pages/OwnerBookingsPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, Search } from 'lucide-react';

import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { useConfirmBooking } from '../hooks/useConfirmBooking';
import { useCancelBookingOwner } from '../hooks/useCancelBookingOwner';
import { OwnerBookingCard } from '../components/OwnerBookingCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { BookingStatus } from '@/features/bookings/types';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

type FilterStatus = BookingStatus | 'all';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function OwnerBookingsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { data, isLoading, isError, refetch } = useOwnerBookings(page);

  const confirmMutation = useConfirmBooking();
  const cancelMutation = useCancelBookingOwner();

  const filteredBookings =
    data?.data.filter((b) => filter === 'all' || b.booking_status === filter) ??
    [];

  const handleConfirm = (id: number) => {
    confirmMutation.mutate(id);
  };

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Calendar className="size-7 text-primary" />
            Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            All bookings across your spaces
          </p>
        </div>
        {data && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.meta.total} total
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

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
            Failed to load bookings
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty - no bookings at all */}
      {data && filteredBookings.length === 0 && filter === 'all' && (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="Bookings will appear here when customers reserve your spaces."
          actionLabel="View My Spaces"
          actionHref="/owner/spaces"
        />
      )}

      {/* Empty - filtered */}
      {data && filteredBookings.length === 0 && filter !== 'all' && (
        <EmptyState
          icon={Search}
          title={`No ${filter} bookings`}
          description="Try a different filter to see other bookings."
          actionLabel="Show All Bookings"
          onAction={() => setFilter('all')}
        />
      )}

      {/* Data */}
      {data && filteredBookings.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredBookings.map((booking) => (
              <motion.div key={booking.id} variants={staggerItem}>
                <OwnerBookingCard
                  booking={booking}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  isConfirming={
                    confirmMutation.isPending &&
                    confirmMutation.variables === booking.id
                  }
                  isCancelling={
                    cancelMutation.isPending &&
                    cancelMutation.variables === booking.id
                  }
                />
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
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={!data.links.next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}