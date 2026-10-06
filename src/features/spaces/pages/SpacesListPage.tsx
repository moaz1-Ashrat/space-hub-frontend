import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpaces } from '../hooks/useSpaces';
import { SpaceCard } from '../components/SpaceCard';
import { SpaceCardSkeleton } from '../components/SpaceCardSkeleton';
import { SpaceFilters } from '../components/SpaceFilters';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import type { SpaceFilters as Filters } from '../types';

export function SpacesListPage() {
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

  return (
    <div className="container mx-auto py-8">
      {/* Back to Dashboard (if logged in) */}
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
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SpaceCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
              <p className="text-error">Failed to load spaces.</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {data && data.data.length === 0 && (
            <div className="p-12 text-center bg-card border border-border rounded-xl">
              <p className="text-lg font-medium">No spaces found</p>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters
              </p>
            </div>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.data.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>

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