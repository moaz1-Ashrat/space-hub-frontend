// src/features/bookings/pages/CheckoutPage.tsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { useBooking } from '../hooks/useBooking';
import { useCheckout } from '@/features/payments/hooks/useCheckout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useBooking(Number(id));
  const checkout = useCheckout();

  // Loading
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-12 rounded-md" />
      </div>
    );
  }

  // Error
  if (isError || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-16 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <p className="text-xl font-heading font-semibold mb-1">
          Booking not found
        </p>
        <Button asChild className="mt-4">
          <Link to="/customer/bookings">
            <ArrowLeft className="size-4 me-2" />
            Back to Bookings
          </Link>
        </Button>
      </motion.div>
    );
  }

  const booking = data.data;

  // No payment
  if (!booking.payment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-16 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-warning/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-warning" />
        </div>
        <p className="text-xl font-heading font-semibold mb-1">
          No payment found
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          This booking doesn't have a payment record.
        </p>
        <Button asChild variant="outline">
          <Link to="/customer/bookings">Back to Bookings</Link>
        </Button>
      </motion.div>
    );
  }

  // Already paid
  if (booking.payment.payment_status === 'paid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="size-10 text-success" />
        </motion.div>
        <p className="text-xl font-heading font-semibold mb-1">
          Already Paid
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          This booking has already been paid successfully.
        </p>
        <Button asChild>
          <Link to={`/customer/bookings/${booking.id}`}>
            View Booking
          </Link>
        </Button>
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to={`/customer/bookings/${booking.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to booking
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Lock className="size-7 text-primary" />
          Secure Checkout
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your booking payment
        </p>
      </div>

      {/* Order Summary */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6 space-y-4"
      >
        <motion.h3
          variants={staggerItem}
          className="font-heading font-semibold flex items-center gap-2"
        >
          <CreditCard className="size-4 text-primary" />
          Order Summary
        </motion.h3>

        <motion.div variants={staggerItem} className="space-y-3 text-sm">
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
            <span className="font-semibold text-base">Amount Due</span>
            <span className="font-mono font-bold text-primary text-xl">
              {Number(booking.payment.amount).toFixed(2)} EGP
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 space-y-4"
      >
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Payment Method
        </h3>

        <div className="relative p-4 border-2 border-primary rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
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
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20 text-xs">
          <ShieldCheck className="size-3.5 text-success shrink-0 mt-0.5" />
          <span className="text-success">
            Your payment is secure and encrypted. Booking will be confirmed
            immediately after payment.
          </span>
        </div>
      </motion.div>

      {/* Action */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          className="w-full h-12 text-base"
          size="lg"
          onClick={handleCheckout}
          disabled={checkout.isPending}
        >
          {checkout.isPending ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin me-2" />
              Processing payment...
            </>
          ) : (
            <>
              <Lock className="size-4 me-2" />
              Pay {Number(booking.payment.amount).toFixed(2)} EGP
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </motion.div>
  );
}