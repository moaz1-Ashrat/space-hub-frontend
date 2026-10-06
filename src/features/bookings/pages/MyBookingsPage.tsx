import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { BookingCard } from '../components/BookingCard';
import { Button } from '@/components/ui/button';
import type { BookingStatus } from '../types';

type FilterStatus = BookingStatus | 'all';

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { data, isLoading, isError } = useBookings(page);

  const filteredBookings =
    data?.data.filter((b) => filter === 'all' || b.booking_status === filter) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage all your space bookings
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load bookings.</p>
        </div>
      )}

      {data && filteredBookings.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-lg font-medium">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
          <p className="text-muted-foreground mt-1 mb-4">
            {filter === 'all'
              ? 'Start exploring spaces and make your first booking'
              : 'Try a different filter'}
          </p>
          {filter === 'all' && (
            <Link to="/spaces">
              <Button>Browse Spaces</Button>
            </Link>
          )}
        </div>
      )}

      {data && filteredBookings.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
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