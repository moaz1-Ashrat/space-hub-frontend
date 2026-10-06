import { useState } from 'react';
import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { useConfirmBooking } from '../hooks/useConfirmBooking';
import { useCancelBookingOwner } from '../hooks/useCancelBookingOwner';
import { OwnerBookingCard } from '../components/OwnerBookingCard';
import { Button } from '@/components/ui/button';
import type { BookingStatus } from '@/features/bookings/types';

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
  const { data, isLoading, isError } = useOwnerBookings(page);

  const confirmMutation = useConfirmBooking();
  const cancelMutation = useCancelBookingOwner();

  const filteredBookings =
    data?.data.filter((b) => filter === 'all' || b.booking_status === filter) ?? [];

  const handleConfirm = (id: number) => {
    confirmMutation.mutate(id);
  };

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-1">
          All bookings across your spaces
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load bookings</p>
        </div>
      )}

      {data && filteredBookings.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-lg font-medium">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
          <p className="text-muted-foreground mt-1">
            Bookings will appear here when customers reserve your spaces
          </p>
        </div>
      )}

      {data && filteredBookings.length > 0 && (
        <>
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <OwnerBookingCard
                key={booking.id}
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
            ))}
          </div>

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
    </div>
  );
}