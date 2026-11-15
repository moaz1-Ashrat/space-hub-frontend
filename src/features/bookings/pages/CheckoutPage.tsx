import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck, Banknote } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { useCheckout } from '@/features/payments/hooks/useCheckout';
import { paymentService } from '@/features/payments/services/paymentService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useBooking(Number(id));
  const checkout = useCheckout();
  const [isCashPending, setIsCashPending] = useState(false);

  if (isLoading) return <div className="max-w-2xl mx-auto space-y-6"><Skeleton className="h-48 rounded-xl" /></div>;
  if (isError || !data) return <div className="text-center py-16">Booking not found</div>;

  const booking = data.data;

  if (!booking.payment) return <div className="text-center py-16 text-warning">No payment record found.</div>;

  if (booking.payment.payment_status === 'paid' || booking.payment.payment_methode === 'cash') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-16 text-center">
        <CheckCircle2 className="size-16 mx-auto text-success mb-4" />
        <h2 className="text-2xl font-bold">Payment Handled</h2>
        <p className="text-muted-foreground mt-2">Your booking is confirmed.</p>
        <Button asChild className="mt-6"><Link to={`/customer/bookings/${booking.id}`}>View Booking & Invoice</Link></Button>
      </motion.div>
    );
  }

  const handleKashierCheckout = async () => {
    await checkout.mutateAsync(booking.payment!.id);
  };

  const handleCashCheckout = async () => {
    setIsCashPending(true);
    try {
      await paymentService.payWithCash(booking.payment!.id);
      toast.success('Booking confirmed! Please pay cash on arrival.');
      navigate(`/customer/bookings/${booking.id}/invoice`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      setIsCashPending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <Link to={`/customer/bookings/${booking.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Lock className="size-7 text-primary" /> Secure Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your booking payment</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><CreditCard className="size-4 text-primary" /> Order Summary</h3>
        <div className="flex justify-between text-sm"><span>Space</span><span className="font-medium">{booking.space.name}</span></div>
        <div className="flex justify-between text-sm"><span>Booking ID</span><span className="font-mono">#{booking.id}</span></div>
        <div className="flex justify-between pt-3 border-t border-border font-bold text-lg"><span>Amount Due</span><span className="text-primary">{Number(booking.payment.amount).toFixed(2)} EGP</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kashier Option */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><CreditCard className="size-5 text-primary" /> Pay Online</h3>
            <p className="text-sm text-muted-foreground">Secure payment via Credit/Debit Card (Kashier).</p>
          </div>
          <Button 
            className="w-full mt-4 bg-[#0066cc] hover:bg-[#0052a3] text-white" 
            onClick={handleKashierCheckout} 
            disabled={checkout.isPending || isCashPending}
          >
            {checkout.isPending ? 'Redirecting...' : 'Pay with Kashier'}
          </Button>
        </div>

        {/* Cash Option */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><Banknote className="size-5 text-success" /> Pay with Cash</h3>
            <p className="text-sm text-muted-foreground">Confirm booking now and pay cash upon arrival.</p>
          </div>
          <Button 
            variant="outline"
            className="w-full mt-4 border-success text-success hover:bg-success/10" 
            onClick={handleCashCheckout} 
            disabled={checkout.isPending || isCashPending}
          >
            {isCashPending ? 'Confirming...' : 'Confirm Cash Payment'}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4" /> All transactions are secure and encrypted.
      </div>
    </motion.div>
  );
}