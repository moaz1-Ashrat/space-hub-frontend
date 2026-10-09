// src/features/owner/pages/MySpacesPage.tsx
import { Link } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useOwnerSpaces } from '../hooks/useOwnerSpaces';
import { useDeleteSpace } from '../hooks/useDeleteSpace';
import { OwnerSpaceCard } from '../components/OwnerSpaceCard';
import { SpaceCardSkeleton } from '@/features/spaces/components/SpaceCardSkeleton';
import { EmptySpaces } from '@/features/spaces/components/EmptySpaces';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function MySpacesPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useOwnerSpaces();
  const deleteMutation = useDeleteSpace();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            {t('owner.spaces.title', 'My Spaces')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('owner.spaces.subtitle', 'Manage all your listed spaces')}
          </p>
        </div>

        <Link to="/owner/spaces/create">
          <Button>
            <Plus className="size-4" />
            {t('owner.spaces.addNew', 'Add New Space')}
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SpaceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">
            {t('owner.spaces.error.title', 'Failed to load spaces')}
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t(
              'owner.spaces.error.description',
              'Something went wrong. Please try again.'
            )}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {t('common.retry', 'Try Again')}
          </Button>
        </motion.div>
      )}

      {/* Empty */}
      {data && data.data.length === 0 && <EmptySpaces variant="owner" />}

      {/* Data */}
      {data && data.data.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {data.data.map((space) => (
            <motion.div key={space.id} variants={staggerItem}>
              <OwnerSpaceCard space={space} onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}