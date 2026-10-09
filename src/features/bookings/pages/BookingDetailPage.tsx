// src/features/bookings/pages/BookingDetailPage.tsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

import { useBooking } from '../hooks/useBooking';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { BookingStatusBadge } from '../components/BookingStatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/animations';

const TIMELINE = [
  { key: 'pending', label: 'Booking Created', desc: 'Waiting for owner confirmation' },
  { key: 'confirmed', label: 'Booking Confirmed', desc: 'Owner approved your booking' },
  { key: 'completed', label: 'Booking Completed', desc: 'You have used this space' },
];

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useBooking(Number(id));
  const cancelMutation = useCancelBooking();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-16 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <p className="text-xl font-heading font-semibold mb-1">
          Booking not found
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          The booking you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button asChild>
            <Link to="/customer/bookings">
              <ArrowLeft className="size-4 me-2" />
              Back to Bookings
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  const booking = data.data;
  const startDate = new Date(booking.start_datetime);
  const endDate = new Date(booking.end_datetime);

  const canCancel =
    booking.booking_status === 'pending' ||
    booking.booking_status === 'confirmed';
  const canPay =
    booking.booking_status !== 'cancelled' &&
    booking.payment?.payment_status === 'pending';

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    await cancelMutation.mutateAsync(booking.id);
  };

  // Timeline progress
  const statusOrder = ['pending', 'confirmed', 'completed'];
  const currentStep = statusOrder.indexOf(booking.booking_status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to="/customer/bookings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </Link>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-xl p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-heading font-bold">
                {booking.space.name}
              </h1>
              <BookingStatusBadge status={booking.booking_status} />
            </div>
            <p className="text-sm text-muted-foreground font-mono">
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
      </motion.div>

      {/* Timeline */}
      {booking.booking_status !== 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-heading font-semibold mb-5">Progress</h3>
          <div className="space-y-1">
            {TIMELINE.map((step, i) => {
              const isDone = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.key} className="flex gap-4">
                  {/* Indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={`w-0.5 h-8 ${
                          i < currentStep ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-4 ${i === TIMELINE.length - 1 ? 'pb-0' : ''}`}>
                    <p
                      className={`font-medium text-sm ${
                        isCurrent ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Cancelled banner */}
      {booking.booking_status === 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 flex items-start gap-3"
        >
          <XCircle className="size-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-destructive">This booking was cancelled</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              This booking is no longer active. If you believe this is a mistake, please contact support.
            </p>
          </div>
        </motion.div>
      )}

      {/* Details Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Schedule */}
        <motion.div
          variants={staggerItem}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            Schedule
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                <Clock className="size-3" />
                Check-in
              </div>
              <div className="font-medium">
                {startDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-xs text-primary mt-0.5">
                {startDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                <Clock className="size-3" />
                Check-out
              </div>
              <div className="font-medium">
                {endDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-xs text-primary mt-0.5">
                {endDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment */}
        <motion.div
          variants={staggerItem}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            Payment
          </h3>
          {booking.payment ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${
                    booking.payment.payment_status === 'paid'
                      ? 'bg-success/10 text-success'
                      : booking.payment.payment_status === 'failed'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {booking.payment.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-mono font-medium">
                  {Number(booking.payment.amount).toFixed(2)} EGP
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold">You Paid</span>
                <span className="font-mono font-bold text-primary">
                  {Number(booking.customer_paid).toFixed(2)} EGP
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment record</p>
          )}
        </motion.div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-heading font-semibold mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {canPay && (
            <Button
              onClick={() =>
                navigate(`/customer/bookings/${booking.id}/checkout`)
              }
            >
              <CreditCard className="size-4 me-2" />
              Pay Now
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              {cancelMutation.isPending ? (
                'Cancelling...'
              ) : (
                <>
                  <XCircle className="size-4 me-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          )}

          {!canPay && !canCancel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="size-4" />
              No actions available for this booking
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}