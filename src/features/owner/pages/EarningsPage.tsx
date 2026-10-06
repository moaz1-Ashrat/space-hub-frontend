import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { EarningsCard } from '../components/EarningsCard';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';

export function EarningsPage() {
  const { data, isLoading } = useOwnerBookings(1);

  const bookings = data?.data ?? [];

  const completedBookings = bookings.filter(
    (b) => b.booking_status === 'completed' || b.booking_status === 'confirmed'
  );

  const totalRevenue = completedBookings.reduce(
    (sum, b) => sum + Number(b.total_amount ?? 0),
    0
  );
  const totalCommission = completedBookings.reduce(
    (sum, b) => sum + Number(b.commission_amount ?? 0),
    0
  );
  const totalPayout = completedBookings.reduce(
    (sum, b) => sum + Number(b.owner_payout ?? 0),
    0
  );

  const averageRate =
    completedBookings.length > 0
      ? completedBookings.reduce(
          (sum, b) => sum + Number(b.commission_rate ?? 0),
          0
        ) / completedBookings.length
      : 0.1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Earnings</h1>
        <p className="text-muted-foreground mt-1">
          Your revenue and payouts overview
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      ) : (
        <EarningsCard
          totalRevenue={totalRevenue}
          totalCommission={totalCommission}
          totalPayout={totalPayout}
          averageRate={averageRate}
        />
      )}

      {/* Breakdown */}
      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">
          Earnings Breakdown
        </h2>

        {completedBookings.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <p className="text-lg font-medium">No earnings yet</p>
            <p className="text-muted-foreground mt-1">
              Confirmed and completed bookings will show here
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {completedBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {booking.space.name}
                    </span>
                    <BookingStatusBadge status={booking.booking_status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Booking #{booking.id} •{' '}
                    {new Date(booking.start_datetime).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-success">
                    +{Number(booking.owner_payout ?? 0).toFixed(2)} EGP
                  </div>
                  <div className="text-xs text-muted-foreground">
                    from {Number(booking.total_amount ?? 0).toFixed(2)} EGP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}