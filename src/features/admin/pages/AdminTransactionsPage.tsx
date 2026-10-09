// src/features/admin/pages/AdminTransactionsPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Filter,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';

import { useTransactions } from '../hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { TransactionFilters } from '../types';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

type StatusFilter = 'all' | 'pending' | 'paid' | 'failed';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

const statusColors = {
  paid: 'bg-success/10 text-success border-success/30',
  pending: 'bg-warning/10 text-warning border-warning/30',
  failed: 'bg-destructive/10 text-destructive border-destructive/30',
} as const;

export function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters: TransactionFilters = {
    page,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    ...(dateFrom ? { from: dateFrom } : {}),
    ...(dateTo ? { to: dateTo } : {}),
  };

  const { data, isLoading, isError, refetch } = useTransactions(filters);

  const hasDateFilters = !!dateFrom || !!dateTo;
  const hasAnyFilter = statusFilter !== 'all' || hasDateFilters;

  const handleClearFilters = () => {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  // Compute totals from current page
  const totalOnPage = data?.data.reduce((s, t) => s + Number(t.amount), 0) ?? 0;

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
            <CreditCard className="size-7 text-primary" />
            Transactions
          </h1>
          <p className="text-muted-foreground mt-1">
            All payments across the platform
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {data.meta.total} transaction{data.meta.total === 1 ? '' : 's'}
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats bar (current page) */}
      {data && data.data.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="size-3.5" />
              Total on this page
            </div>
            <div className="font-mono font-bold text-lg text-primary">
              {totalOnPage.toFixed(2)} EGP
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <CreditCard className="size-3.5" />
              Showing
            </div>
            <div className="font-bold text-lg">
              {data.data.length} / {data.meta.total}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Calendar className="size-3.5" />
              Page
            </div>
            <div className="font-bold text-lg">
              {data.meta.current_page} / {data.meta.last_page}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters Row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2 items-center"
      >
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === f.value
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {f.label}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`ms-auto ${hasDateFilters ? 'border-primary/40 text-primary' : ''}`}
        >
          <Filter className="size-3.5" />
          Date Range
          {hasDateFilters && (
            <span className="ms-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </Button>

        {hasAnyFilter && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </motion.div>

      {/* Date filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              From Date
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              To Date
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
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
            Failed to load transactions
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
      {data && data.data.length === 0 && !hasAnyFilter && (
        <EmptyState
          icon={CreditCard}
          title="No transactions yet"
          description="Transactions will appear here as customers make payments."
        />
      )}

      {/* Empty - filtered */}
      {data && data.data.length === 0 && hasAnyFilter && (
        <EmptyState
          icon={Search}
          title="No transactions match your filters"
          description="Try adjusting your status or date range."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* Data Table */}
      {data && data.data.length > 0 && (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 p-4 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Booking</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-border"
            >
              {data.data.map((t) => (
                <motion.div
                  key={t.id}
                  variants={staggerItem}
                  className="grid grid-cols-2 md:grid-cols-12 gap-3 p-4 items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="md:col-span-1 font-mono text-xs text-muted-foreground">
                    #{t.id}
                  </div>
                  <div className="md:col-span-3 text-sm font-medium truncate">
                    {t.customer_name ?? '—'}
                  </div>
                  <div className="md:col-span-2 font-mono text-xs text-muted-foreground">
                    {t.booking_id ? `#${t.booking_id}` : '—'}
                  </div>
                  <div className="md:col-span-2">
                    <span
                      className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${statusColors[t.payment_status]}`}
                    >
                      {t.payment_status}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-xs text-muted-foreground">
                    {t.payment_date_time
                      ? new Date(t.payment_date_time).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )
                      : '—'}
                  </div>
                  <div className="md:col-span-2 text-right font-mono font-bold text-primary">
                    {Number(t.amount).toFixed(2)} EGP
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                disabled={data.meta.current_page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={data.meta.current_page === data.meta.last_page}
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