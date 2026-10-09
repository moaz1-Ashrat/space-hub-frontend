// src/features/bookings/components/EmptyBookings.tsx
import { CalendarX2, CalendarCheck } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from 'react-i18next';

interface EmptyBookingsProps {
  variant?: 'customer' | 'owner';
}

export function EmptyBookings({ variant = 'customer' }: EmptyBookingsProps) {
  const { t } = useTranslation();

  if (variant === 'owner') {
    return (
      <EmptyState
        icon={CalendarCheck}
        title={t('bookings.empty.owner.title', 'No bookings yet')}
        description={t(
          'bookings.empty.owner.description',
          'Your spaces haven’t been booked yet. Make sure your listings are approved and up to date.'
        )}
        actionLabel={t('bookings.empty.owner.action', 'Manage My Spaces')}
        actionHref="/owner/spaces"
      />
    );
  }

  return (
    <EmptyState
      icon={CalendarX2}
      title={t('bookings.empty.customer.title', 'No bookings yet')}
      description={t(
        'bookings.empty.customer.description',
        "You haven't booked any spaces yet. Browse our available spaces and make your first booking!"
      )}
      actionLabel={t('bookings.empty.customer.action', 'Browse Spaces')}
      actionHref="/spaces"
    />
  );
}