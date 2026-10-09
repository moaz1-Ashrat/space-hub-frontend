// src/features/admin/pages/AdminAllSpacesPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  XCircle,
} from 'lucide-react';

import { useAllSpaces } from '../hooks/useAllSpaces';
import { useApproveSpace } from '../hooks/useApproveSpace';
import { useRejectSpace } from '../hooks/useRejectSpace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem } from '@/lib/animations';
import type { SpaceFilters } from '../types';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/30',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/30',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/30',
    icon: XCircle,
  },
} as const;

const STATUS_TABS: Array<{ value: '' | 'pending' | 'approved' | 'rejected'; label: string }> = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export function AdminAllSpacesPage() {
  const [filters, setFilters] = useState<SpaceFilters>({ page: 1 });
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useAllSpaces(filters);
  const approveMutation = useApproveSpace();
  const rejectMutation = useRejectSpace();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: search.trim() || undefined, page: 1 });
  };

  const handleStatusFilter = (status: '' | 'pending' | 'approved' | 'rejected') => {
    setFilters({
      ...filters,
      approval_status: status || undefined,
      page: 1,
    });
  };

  const spaces = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Building2 className="size-7 text-primary" />
            All Spaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Review, approve, and manage every space on the platform
          </p>
        </div>

        {data && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.meta.total} space{data.meta.total === 1 ? '' : 's'}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusFilter(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                (filters.approval_status ?? '') === tab.value
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
          <AlertCircle className="size-10 mx-auto text-destructive mb-3" />
          <p className="text-lg font-medium text-destructive">
            Failed to load spaces
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            The admin endpoint may not be available yet.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty */}
      {data && spaces.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No spaces found"
          description="Try adjusting your filters or search query."
        />
      )}

      {/* Data */}
      {data && spaces.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {spaces.map((space) => {
              const config = STATUS_CONFIG[space.approval_status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={space.id}
                  variants={staggerItem}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {space.primary_image ? (
                      <img
                        src={space.primary_image.url}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="size-8 text-primary/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-heading font-semibold truncate">
                        {space.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.className}`}
                      >
                        <StatusIcon className="size-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      📍 {space.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      👤 {space.owner.name} · {space.owner.email}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0 hidden md:block">
                    <div className="font-mono font-bold text-primary">
                      {Number(space.price_per_hour).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      EGP/hour
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/spaces/${space.id}`} target="_blank">
                        <Eye className="size-3.5" />
                      </Link>
                    </Button>

                    {space.approval_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(space.id)}
                          disabled={approveMutation.isPending}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          <CheckCircle2 className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(space.id)}
                          disabled={rejectMutation.isPending}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <XCircle className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                disabled={!data.links.prev}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))
                }
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} / {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={!data.links.next}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}