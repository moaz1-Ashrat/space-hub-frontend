import { useState } from 'react';
import { CreditCard, Filter } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TransactionFilters } from '../types';

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
  failed: 'bg-error/10 text-error border-error/30',
};

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

  const { data, isLoading, isError } = useTransactions(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          All payments across the platform
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-primary text-white'
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
          className="ms-auto"
        >
          <Filter className="size-3.5" />
          Date Range
        </Button>
      </div>

      {/* Date filters */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              From
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
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load transactions</p>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <CreditCard className="size-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 p-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Booking</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            <div className="divide-y divide-border">
              {data.data.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-2 md:grid-cols-12 gap-3 p-3 items-center hover:bg-muted/30 transition-colors"
                >
                  <div className="md:col-span-1 font-mono text-xs text-muted-foreground">
                    #{t.id}
                  </div>
                  <div className="md:col-span-3 text-sm truncate">
                    {t.customer_name ?? '—'}
                  </div>
                  <div className="md:col-span-2 font-mono text-xs text-muted-foreground">
                    {t.booking_id ? `#${t.booking_id}` : '—'}
                  </div>
                  <div className="md:col-span-2">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${
                        statusColors[t.payment_status]
                      }`}
                    >
                      {t.payment_status}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-xs text-muted-foreground">
                    {t.payment_date_time
                      ? new Date(t.payment_date_time).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>
                  <div className="md:col-span-2 text-right font-mono font-bold text-primary">
                    {Number(t.amount).toFixed(2)} EGP
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
}