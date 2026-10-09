// src/features/owner/pages/EarningsPage.tsx
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  AlertCircle,
  Receipt,
} from 'lucide-react';

import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { EarningsCard } from '../components/EarningsCard';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function EarningsPage() {
  const { data, isLoading, isError, refetch } = useOwnerBookings(1);

  const bookings = data?.data ?? [];

  const completedBookings = bookings.filter(
    (b) =>
      b.booking_status === 'completed' || b.booking_status === 'confirmed'
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Wallet className="size-7 text-primary" />
          Earnings
        </h1>
        <p className="text-muted-foreground mt-1">
          Your revenue and payouts overview
        </p>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
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
            Failed to load earnings
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Data */}
      {data && (
        <>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <EarningsCard
              totalRevenue={totalRevenue}
              totalCommission={totalCommission}
              totalPayout={totalPayout}
              averageRate={averageRate}
            />
          </motion.div>

          {/* Breakdown */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              Earnings Breakdown
            </h2>
          </motion.div>

          {completedBookings.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No earnings yet"
              description="Confirmed and completed bookings will appear here once customers start booking your spaces."
              actionLabel="View My Spaces"
              actionHref="/owner/spaces"
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border"
            >
              {completedBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  variants={staggerItem}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">
                        {booking.space.name}
                      </span>
                      <BookingStatusBadge status={booking.booking_status} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Booking #{booking.id} •{' '}
                      {new Date(booking.start_datetime).toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}