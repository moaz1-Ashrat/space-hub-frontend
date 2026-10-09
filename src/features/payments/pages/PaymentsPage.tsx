// src/features/payments/pages/PaymentsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  Receipt,
  Search,
} from 'lucide-react';

import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { PaymentStatus } from '../types';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/30',
    dot: 'bg-warning',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/30',
    dot: 'bg-success',
  },
  failed: {
    label: 'Failed',
    className: 'bg-destructive/10 text-destructive border-destructive/30',
    dot: 'bg-destructive',
  },
};

type StatusFilter = 'all' | PaymentStatus;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

export function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const { data, isLoading, isError, refetch } = usePaymentHistory(page);

  const payments = data?.data ?? [];
  const filteredPayments =
    filter === 'all'
      ? payments
      : payments.filter((p) => p.payment_status === filter);

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
            <Receipt className="size-7 text-primary" />
            Payment History
          </h1>
          <p className="text-muted-foreground mt-1">
            All your payment transactions
          </p>
        </div>
        {data && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.meta.total} transaction{data.meta.total === 1 ? '' : 's'}
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
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
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
            Failed to load payments
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty - no data */}
      {data && payments.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Your payments will appear here after you make your first booking."
          actionLabel="Browse Spaces"
          actionHref="/spaces"
        />
      )}

      {/* Empty - filtered */}
      {data && payments.length > 0 && filteredPayments.length === 0 && (
        <EmptyState
          icon={Search}
          title={`No ${filter} payments`}
          description="Try a different filter to see other payments."
          actionLabel="Show All"
          onAction={() => setFilter('all')}
        />
      )}

      {/* Data */}
      {data && filteredPayments.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border"
          >
            {filteredPayments.map((payment) => {
              const config = statusConfig[payment.payment_status];
              const date = payment.payment_date_time
                ? new Date(payment.payment_date_time)
                : null;

              return (
                <motion.div
                  key={payment.id}
                  variants={staggerItem}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">
                          Payment #{payment.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${config.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                          />
                          {config.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {date
                          ? date.toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Not yet processed'}
                        {payment.payment_methode &&
                          ` • ${payment.payment_methode}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-primary">
                      {Number(payment.amount).toFixed(2)} EGP
                    </div>
                    {payment.booking && (
                      <Link
                        to={`/customer/bookings/${payment.booking.id}`}
                        className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-0.5"
                      >
                        Booking #{payment.booking.id}
                        <ArrowRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3">
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