// src/features/spaces/pages/SpacesListPage.tsx
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useSpaces } from '../hooks/useSpaces';
import { SpaceCard } from '../components/SpaceCard';
import { SpaceCardSkeleton } from '../components/SpaceCardSkeleton';
import { SpaceFilters } from '../components/SpaceFilters';
import { EmptySpaces } from '../components/EmptySpaces';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import type { SpaceFilters as Filters } from '../types';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function SpacesListPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const dashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'space_owner') return '/owner';
    return '/customer';
  };

  const [filters, setFilters] = useState<Filters>(() => {
    const obj: Filters = {};
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    if (type) obj.type = type;
    if (location) obj.location = location;
    return obj;
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useSpaces({ ...filters, page });

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    setSearchParams(params);
  };

  // ✅ الدالة الجديدة لمسح الفلاتر
  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container mx-auto py-8">
      {/* Back to Dashboard */}
      {isAuthenticated && user && (
        <Link
          to={dashboardPath()}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold">Explore Spaces</h1>
        <p className="text-muted-foreground mt-1">
          Find the perfect space for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <SpaceFilters onFilter={handleFilter} initialFilters={filters} />
        </aside>

        <div className="lg:col-span-3">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                {t('spaces.error.title', 'Failed to load spaces')}
              </p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {t(
                  'spaces.error.description',
                  'Something went wrong. Please try again.'
                )}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                {t('common.retry', 'Try Again')}
              </Button>
            </motion.div>
          )}

          {/* Empty - ✅ مع handleClearFilters */}
          {data && data.data.length === 0 && (
            <EmptySpaces
              variant="search"
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Data */}
          {data && data.data.length > 0 && (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {data.data.map((space) => (
                  <motion.div key={space.id} variants={staggerItem}>
                    <SpaceCard space={space} />
                  </motion.div>
                ))}
              </motion.div>

              {data.meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <Button
                    variant="outline"
                    disabled={!data.links.prev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {data.meta.current_page} of {data.meta.last_page}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!data.links.next}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}