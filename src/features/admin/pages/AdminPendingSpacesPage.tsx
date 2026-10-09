// src/features/admin/pages/AdminPendingSpacesPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, PartyPopper } from 'lucide-react';

import { usePendingSpaces } from '../hooks/usePendingSpaces';
import { useApproveSpace } from '../hooks/useApproveSpace';
import { useRejectSpace } from '../hooks/useRejectSpace';
import { AdminSpaceCard } from '../components/AdminSpaceCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function AdminPendingSpacesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = usePendingSpaces(page);
  const approveMutation = useApproveSpace();
  const rejectMutation = useRejectSpace();

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
            <Clock className="size-7 text-warning" />
            Pending Spaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve new space listings
          </p>
        </div>
        {data && data.meta.total > 0 && (
          <div className="px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium flex items-center gap-1.5">
            <Clock className="size-4" />
            {data.meta.total} awaiting review
          </div>
        )}
      </motion.div>

      {/* Info banner */}
      {data && data.meta.total > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="size-4 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-warning mb-0.5">
                Approve responsibly
              </p>
              <p className="text-muted-foreground">
                Review each space's details, photos, and features before
                approving. Approved spaces become visible to customers
                immediately.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
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
            Failed to load pending spaces
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Something went wrong. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty - All caught up */}
      {data && data.data.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center bg-gradient-to-br from-success/5 via-card to-primary/5 border border-success/20 rounded-xl"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4"
          >
            <PartyPopper className="size-10 text-success" />
          </motion.div>
          <h3 className="text-2xl font-heading font-bold mb-2">
            All Caught Up!
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            There are no spaces awaiting your review right now. New listings
            will appear here as soon as owners submit them.
          </p>
          <Button variant="outline" asChild>
            <a href="/admin/spaces">
              <CheckCircle2 className="size-4 me-2" />
              View All Spaces
            </a>
          </Button>
        </motion.div>
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
            {data.data.map((space) => (
              <motion.div key={space.id} variants={staggerItem}>
                <AdminSpaceCard
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