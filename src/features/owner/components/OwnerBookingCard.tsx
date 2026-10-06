import { Link } from 'react-router-dom';
import {
  Calendar,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';
import type { Booking } from '@/features/bookings/types';

interface OwnerBookingCardProps {
  booking: Booking;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  isConfirming?: boolean;
  isCancelling?: boolean;
}

export function OwnerBookingCard({
  booking,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling,
}: OwnerBookingCardProps) {
  const startDate = new Date(booking.start_datetime);
  const endDate = new Date(booking.end_datetime);

  const canConfirm = booking.booking_status === 'pending';
  const canCancel =
    booking.booking_status === 'pending' || booking.booking_status === 'confirmed';

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold">
              {booking.space.name}
            </h3>
            <BookingStatusBadge status={booking.booking_status} />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Booking #{booking.id}
          </p>
        </div>

        <div className="text-right">
          <div className="font-mono font-bold text-primary text-lg">
            {Number(booking.total_amount).toFixed(2)} EGP
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span>
            {startDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}{' '}
            • {startDate.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' → '}
            {endDate.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="size-4 shrink-0" />
          <span>Customer #{booking.id}</span>
        </div>
      </div>

      {/* Owner Earnings (visible only to owner) */}
      {booking.commission_rate !== undefined && (
        <div className="pt-3 border-t border-border grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Commission</div>
            <div className="font-mono font-medium text-warning">
              -{Number(booking.commission_amount ?? 0).toFixed(2)} EGP
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rate</div>
            <div className="font-mono font-medium">
              {((booking.commission_rate ?? 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Your Payout</div>
            <div className="font-mono font-bold text-success flex items-center gap-1">
              <DollarSign className="size-3.5" />
              {Number(booking.owner_payout ?? 0).toFixed(2)} EGP
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        {canConfirm && (
          <Button
            size="sm"
            onClick={() => onConfirm(booking.id)}
            disabled={isConfirming}
          >
            <CheckCircle className="size-3.5" />
            {isConfirming ? 'Confirming...' : 'Confirm'}
          </Button>
        )}

        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(booking.id)}
            disabled={isCancelling}
            className="text-error border-error/30 hover:bg-error/10"
          >
            <XCircle className="size-3.5" />
            {isCancelling ? 'Cancelling...' : 'Cancel'}
          </Button>
        )}

        <Link to={`/customer/bookings/${booking.id}`} className="ms-auto">
          <Button variant="ghost" size="sm">
            Details
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}