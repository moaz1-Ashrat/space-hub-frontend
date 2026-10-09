// src/features/spaces/components/EmptySpaces.tsx
import { Building2, SearchX } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTranslation } from 'react-i18next';

interface EmptySpacesProps {
  variant?: 'search' | 'owner';
  onClearFilters?: () => void;
}

export function EmptySpaces({
  variant = 'search',
  onClearFilters,
}: EmptySpacesProps) {
  const { t } = useTranslation();

  if (variant === 'owner') {
    return (
      <EmptyState
        icon={Building2}
        title={t('spaces.empty.owner.title', 'No spaces yet')}
        description={t(
          'spaces.empty.owner.description',
          'Start by adding your first space. You can manage all your listings from here.'
        )}
        actionLabel={t('spaces.empty.owner.action', 'Add Your First Space')}
        actionHref="/owner/spaces/create"
      />
    );
  }

  return (
    <EmptyState
      icon={SearchX}
      title={t('spaces.empty.search.title', 'No spaces found')}
      description={t(
        'spaces.empty.search.description',
        "We couldn't find any spaces matching your filters. Try adjusting your search criteria."
      )}
      actionLabel={t('spaces.empty.search.action', 'Clear Filters')}
      onAction={onClearFilters}
    />
  );
}