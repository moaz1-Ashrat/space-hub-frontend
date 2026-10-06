import { useState } from 'react';
import { Clock } from 'lucide-react';
import { usePendingSpaces } from '../hooks/usePendingSpaces';
import { useApproveSpace } from '../hooks/useApproveSpace';
import { useRejectSpace } from '../hooks/useRejectSpace';
import { AdminSpaceCard } from '../components/AdminSpaceCard';
import { Button } from '@/components/ui/button';

export function AdminPendingSpacesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePendingSpaces(page);
  const approveMutation = useApproveSpace();
  const rejectMutation = useRejectSpace();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Pending Spaces</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve new space listings
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load pending spaces</p>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <Clock className="size-12 mx-auto text-success mb-3" />
          <p className="text-lg font-medium">All caught up! 🎉</p>
          <p className="text-muted-foreground mt-1">
            No spaces awaiting approval right now
          </p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((space) => (
              <AdminSpaceCard
                key={space.id}
                space={space}
                onApprove={(id) => approveMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                isApproving={
                  approveMutation.isPending &&
                  approveMutation.variables === space.id
                }
                isRejecting={
                  rejectMutation.isPending &&
                  rejectMutation.variables === space.id
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