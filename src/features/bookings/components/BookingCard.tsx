import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { BookingStatusBadge } from './BookingStatusBadge';
import type { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const startDate = new Date(booking.start_datetime);
  const endDate = new Date(booking.end_datetime);

  return (
    <Link
      to={`/customer/bookings/${booking.id}`}
      className="block bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading font-semibold truncate">
              {booking.space.name}
            </h3>
            <BookingStatusBadge status={booking.booking_status} />
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>
                {startDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="text-xs">
              {startDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' → '}
              {endDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono font-bold text-primary text-lg">
            {Number(booking.total_amount).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">EGP</div>
          <ArrowRight className="size-4 ms-auto mt-2 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}