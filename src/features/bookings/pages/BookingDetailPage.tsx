import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { Button } from '@/components/ui/button';

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useBooking(Number(id));
  const cancelMutation = useCancelBooking();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl font-medium">Booking not found</p>
        <Link to="/customer/bookings" className="text-primary hover:underline mt-2 inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  const booking = data.data;
  const startDate = new Date(booking.start_datetime);
  const endDate = new Date(booking.end_datetime);

  const canCancel =
    booking.booking_status === 'pending' || booking.booking_status === 'confirmed';
  const canPay =
    booking.booking_status !== 'cancelled' &&
    booking.payment?.payment_status === 'pending';

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    await cancelMutation.mutateAsync(booking.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/customer/bookings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </Link>

      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-heading font-bold">
                {booking.space.name}
              </h1>
              <BookingStatusBadge status={booking.booking_status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Booking #{booking.id}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold font-mono text-primary">
              {Number(booking.total_amount).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">EGP</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schedule */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Calendar className="size-4" />
            Schedule
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Check-in</div>
              <div className="font-medium">
                {startDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-xs">
                {startDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Check-out</div>
              <div className="font-medium">
                {endDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-xs">
                {endDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="size-4" />
            Payment
          </h3>
          {booking.payment ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">
                  {booking.payment.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono font-medium">
                  {Number(booking.payment.amount).toFixed(2)} EGP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer Paid</span>
                <span className="font-mono font-medium">
                  {Number(booking.customer_paid).toFixed(2)} EGP
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment record</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading font-semibold mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {canPay && (
            <Button
              onClick={() =>
                navigate(`/customer/bookings/${booking.id}/checkout`)
              }
            >
              <CreditCard className="size-4" />
              Pay Now
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="text-error border-error/30 hover:bg-error/10"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          )}

          {!canPay && !canCancel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="size-4" />
              No actions available for this booking
            </div>
          )}
        </div>
      </div>
    </div>
  );
}