import type { BookingStatus } from '../types';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-success/10 text-success border-success/30',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-error/10 text-error border-error/30',
  },
  completed: {
    label: 'Completed',
    className: 'bg-info/10 text-info border-info/30',
  },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}