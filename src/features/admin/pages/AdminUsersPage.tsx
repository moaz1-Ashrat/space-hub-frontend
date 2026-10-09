// src/features/admin/pages/AdminUsersPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Users } from 'lucide-react';

import { useAdminUsers } from '../hooks/useAdminUsers';
import { useSuspendUser } from '../hooks/useSuspendUser';
import { useActivateUser } from '../hooks/useActivateUser';
import { AdminUserCard } from '../components/AdminUserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { UserFilters } from '../types';
import type { UserRole } from '@/types';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

type RoleFilter = UserRole | 'all';

const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Customers', value: 'customer' },
  { label: 'Owners', value: 'space_owner' },
  { label: 'Admins', value: 'admin' },
];

export function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const filters: UserFilters = {
    page,
    ...(roleFilter !== 'all' ? { role: roleFilter } : {}),
    ...(search ? { search } : {}),
  };

  const { data, isLoading, isError, refetch } = useAdminUsers(filters);
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const hasActiveFilters = roleFilter !== 'all' || !!search;

  const handleClearFilters = () => {
    setRoleFilter('all');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Users className="size-7 text-primary" />
            Users Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all platform users and their access
          </p>
        </div>
        {data && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {data.meta.total} user{data.meta.total === 1 ? '' : 's'}
          </div>
        )}
      </motion.div>

      {/* Filters Row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row gap-3"
      >
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="ps-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setRoleFilter(f.value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                roleFilter === f.value
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

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
          <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="size-7 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">
            Failed to load users
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty - no data at all */}
      {data && data.data.length === 0 && !hasActiveFilters && (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Users will appear here once they register on the platform."
        />
      )}

      {/* Empty - filtered */}
      {data && data.data.length === 0 && hasActiveFilters && (
        <EmptyState
          icon={Search}
          title="No users match your filters"
          description="Try adjusting your search or role filter to find what you're looking for."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* Data */}
      {data && data.data.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {data.data.map((user) => (
              <motion.div key={user.id} variants={staggerItem}>
                <AdminUserCard
                  user={user}
                  onSuspend={(id) => suspendMutation.mutate(id)}
                  onActivate={(id) => activateMutation.mutate(id)}
                  isSuspending={
                    suspendMutation.isPending &&
                    suspendMutation.variables === user.id
                  }
                  isActivating={
                    activateMutation.isPending &&
                    activateMutation.variables === user.id
                  }
                />
              </motion.div>
            ))}
          </motion.div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
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
    </motion.div>
  );
}