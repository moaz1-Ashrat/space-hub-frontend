import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { useCheckout } from '@/features/payments/hooks/useCheckout';
import { Button } from '@/components/ui/button';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useBooking(Number(id));
  const checkout = useCheckout();

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

  if (!booking.payment) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl font-medium">No payment found for this booking</p>
        <Link to="/customer/bookings" className="text-primary hover:underline mt-2 inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  if (booking.payment.payment_status === 'paid') {
    return (
      <div className="container mx-auto py-16 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <p className="text-xl font-medium">This booking has already been paid</p>
        <Link to="/customer/bookings" className="text-primary hover:underline inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    await checkout.mutateAsync({
      payment_id: booking.payment!.id,
      payment_method: 'manual',
    });
    navigate(`/customer/bookings/${booking.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to={`/customer/bookings/${booking.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to booking
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your booking payment</p>
      </div>

      {/* Order Summary */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-heading font-semibold">Order Summary</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Space</span>
            <span className="font-medium">{booking.space.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono">#{booking.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-mono font-medium">
              {Number(booking.total_amount).toFixed(2)} EGP
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-semibold">Amount Due</span>
            <span className="font-mono font-bold text-primary text-lg">
              {Number(booking.payment.amount).toFixed(2)} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-heading font-semibold">Payment Method</h3>

        <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CreditCard className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Manual Payment</div>
              <div className="text-xs text-muted-foreground">
                Complete payment instantly (test mode)
              </div>
            </div>
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-success" />
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>

      {/* Action */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={checkout.isPending}
      >
        {checkout.isPending ? 'Processing...' : `Pay ${Number(booking.payment.amount).toFixed(2)} EGP`}
      </Button>
    </div>
  );
}