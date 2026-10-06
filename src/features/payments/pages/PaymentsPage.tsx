import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowRight } from 'lucide-react';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { Button } from '@/components/ui/button';
import type { PaymentStatus } from '../types';

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success' },
  failed: { label: 'Failed', className: 'bg-error/10 text-error' },
};

export function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentHistory(page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Payment History</h1>
        <p className="text-muted-foreground mt-1">
          All your payment transactions
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <CreditCard className="size-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-lg font-medium">No payments yet</p>
          <p className="text-muted-foreground mt-1 mb-4">
            Your payments will appear here after you make bookings
          </p>
          <Link to="/spaces">
            <Button>Browse Spaces</Button>
          </Link>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {data.data.map((payment) => {
              const config = statusConfig[payment.payment_status];
              const date = payment.payment_date_time
                ? new Date(payment.payment_date_time)
                : null;

              return (
                <div
                  key={payment.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CreditCard className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          Payment #{payment.id}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {date ? date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : 'Not yet processed'}
                        {payment.payment_methode && ` • ${payment.payment_methode}`}
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
                </div>
              );
            })}
          </div>

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
    </div>
  );
}