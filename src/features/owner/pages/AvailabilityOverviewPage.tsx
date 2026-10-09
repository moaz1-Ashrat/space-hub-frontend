// src/features/owner/pages/AvailabilityOverviewPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { useOwnerSpaces } from '../hooks/useOwnerSpaces';
import { SpaceCardSkeleton } from '@/features/spaces/components/SpaceCardSkeleton';
import { EmptySpaces } from '@/features/spaces/components/EmptySpaces';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function AvailabilityOverviewPage() {
  const { data, isLoading, isError, refetch } = useOwnerSpaces();

  const spaces = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Clock className="size-7 text-primary" />
          Availability Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a space to manage its weekly availability slots
        </p>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
        <p className="font-medium mb-1">💡 Quick tip</p>
        <p className="text-muted-foreground">
          Availability determines when customers can book each space. Set up
          your weekly time slots for each of your listings below.
        </p>
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
            Failed to load spaces
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty */}
      {data && spaces.length === 0 && <EmptySpaces variant="owner" />}

      {/* Data */}
      {data && spaces.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {spaces.map((space) => {
            const coverUrl =
              space.primary_image?.url ?? space.images?.[0]?.url ?? null;

            const isApproved = space.approval_status === 'approved';

            return (
              <motion.div key={space.id} variants={staggerItem}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group">
                  {/* Cover */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative overflow-hidden">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={space.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <Building2 className="size-10 text-primary/30" />
                    )}

                    {/* Approval status */}
                    <span
                      className={`absolute top-3 end-3 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm flex items-center gap-1 ${
                        isApproved
                          ? 'bg-success/15 text-success border-success/30'
                          : 'bg-warning/15 text-warning border-warning/30'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="size-3" />
                          Approved
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3" />
                          {space.approval_status}
                        </>
                      )}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-heading font-semibold line-clamp-1 mb-1">
                      {space.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
                      📍 {space.location}
                    </p>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 hover:border-primary/50 text-primary font-medium transition-all"
                    >
                      <Link to={`/owner/spaces/${space.id}/availability`}>
                        <Clock className="size-3.5" />
                        Manage Availability
                        <ArrowRight className="size-3.5 ms-auto" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}