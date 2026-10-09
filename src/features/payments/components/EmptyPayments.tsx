// src/features/payments/components/EmptyPayments.tsx
import { Receipt } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from 'react-i18next';

export function EmptyPayments() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={Receipt}
      title={t('payments.empty.title', 'No payments yet')}
      description={t(
        'payments.empty.description',
        'Your payment history will appear here once you make your first booking.'
      )}
      actionLabel={t('payments.empty.action', 'Browse Spaces')}
      actionHref="/spaces"
    />
  );
}