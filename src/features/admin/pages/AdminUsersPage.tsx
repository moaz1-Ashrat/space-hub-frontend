import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useSuspendUser } from '../hooks/useSuspendUser';
import { useActivateUser } from '../hooks/useActivateUser';
import { AdminUserCard } from '../components/AdminUserCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserFilters } from '../types';
import type { UserRole } from '@/types';

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

  const { data, isLoading, isError } = useAdminUsers(filters);
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Users Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all platform users and their access
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit">
            <Search className="size-4" />
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setRoleFilter(f.value);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                roleFilter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load users</p>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((user) => (
              <AdminUserCard
                key={user.id}
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
            ))}
          </div>

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
    </div>
  );
}