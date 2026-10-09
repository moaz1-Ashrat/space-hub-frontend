// src/features/owner/pages/SpaceAvailabilityPage.tsx
import { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ownerService } from '../services/ownerService';
import { useSpaceAvailability } from '../hooks/useSpaceAvailability';
import { useCreateAvailability } from '../hooks/useCreateAvailability';
import { useUpdateAvailability } from '../hooks/useUpdateAvailability';
import { useDeleteAvailability } from '../hooks/useDeleteAvailability';
import { AvailabilityCard } from '../components/AvailabilityCard';
import { AvailabilityFormDialog } from '../components/AvailabilityFormDialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Availability, AvailabilityPayload } from '../types';
import { DAY_NAMES } from '../types';
import { staggerContainer, staggerItem } from '@/lib/animations';

export function SpaceAvailabilityPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const spaceId = Number(id);

  // ✅ Detect new space redirect
  const isNewSpace = (location.state as { isNewSpace?: boolean })?.isNewSpace;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Availability | null>(null);

  // Space info
  const { data: spaceData } = useQuery({
    queryKey: ['owner', 'space', spaceId],
    queryFn: () => ownerService.showSpace(spaceId),
    enabled: !!spaceId,
  });

  // Availability list
  const { data, isLoading, isError, refetch } = useSpaceAvailability(spaceId);

  // Mutations
  const createMutation = useCreateAvailability(spaceId);
  const updateMutation = useUpdateAvailability(spaceId);
  const deleteMutation = useDeleteAvailability(spaceId);

  const slots = data?.data ?? [];

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (a: Availability) => {
    setEditing(a);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this availability slot?')) {
      deleteMutation.mutate(id);
    }
  };

  // ✅ Single slot submit with DUPLICATE CHECK
  const handleSubmit = async (payload: AvailabilityPayload) => {
    // Duplicate check (only for new slots, not edits)
    if (!editing) {
      const isDuplicate = slots.some(
        (s) =>
          s.day_of_week === payload.day_of_week &&
          s.start_time === payload.start_time &&
          s.end_time === payload.end_time &&
          !s.special_date &&
          !payload.special_date
      );

      if (isDuplicate) {
        toast.error('This slot already exists', {
          description: `${DAY_NAMES[payload.day_of_week]} ${payload.start_time.slice(0, 5)}-${payload.end_time.slice(0, 5)} is already added`,
        });
        return;
      }
    }

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  // ✅ Batch submit (All Week mode) with DUPLICATE CHECK
  const handleSubmitBatch = async (payloads: AvailabilityPayload[]) => {
    try {
      // Enhanced duplicate check (day + start + end)
      const existing = new Set(
        slots.map((s) => `${s.day_of_week}-${s.start_time}-${s.end_time}`)
      );

      const daysToCreate = payloads.filter(
        (p) =>
          !existing.has(`${p.day_of_week}-${p.start_time}-${p.end_time}`)
      );
      const skippedDays = payloads.length - daysToCreate.length;

      if (daysToCreate.length === 0) {
        toast.warning('All 7 days already have this time slot', {
          description: 'Try a different time range or edit existing slots.',
        });
        setDialogOpen(false);
        setEditing(null);
        return;
      }

      // Create slots sequentially
      for (const payload of daysToCreate) {
        await createMutation.mutateAsync(payload);
      }

      if (skippedDays > 0) {
        toast.success(
          `Created ${daysToCreate.length} slots (${skippedDays} skipped — already exist)`
        );
      } else {
        toast.success(`Created ${daysToCreate.length} slots successfully`);
      }

      setDialogOpen(false);
      setEditing(null);
    } catch {
      // Individual errors already handled by mutation's onError
    }
  };

  // Sort by day then start time
  const sortedSlots = [...slots].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/owner/spaces"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to My Spaces
      </Link>

      {/* New Space Welcome Banner */}
      {isNewSpace && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="p-5 rounded-xl bg-gradient-to-r from-success/10 to-primary/10 border border-success/30 text-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🎉</span>
            <div>
              <p className="font-semibold text-success mb-1">
                Space created successfully!
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Now add at least one weekly time slot below so customers can
                start booking your space. Without availability, the space will
                appear but cannot be reserved.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Clock className="size-7 text-primary" />
            Availability Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            {spaceData?.data?.name
              ? `Manage weekly time slots for "${spaceData.data.name}"`
              : 'Manage weekly time slots for this space'}
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="size-4 me-2" />
          Add Slot
        </Button>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
        <p className="font-medium mb-1">💡 How availability works</p>
        <p className="text-muted-foreground">
          Define the weekly time ranges when customers can book this space.
          Each slot is a specific day of the week with a start and end time.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
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
            Failed to load availability
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Empty */}
      {data && slots.length === 0 && (
        <EmptyState
          icon={Clock}
          title={
            isNewSpace
              ? 'Add your first time slot'
              : 'No availability set up yet'
          }
          description={
            isNewSpace
              ? 'Choose a day of the week and time range when customers can book this space.'
              : 'Add your first weekly time slot so customers can start booking this space.'
          }
          actionLabel="Add First Slot"
          onAction={handleAdd}
        />
      )}

      {/* Data */}
      {data && sortedSlots.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {sortedSlots.map((slot) => (
            <motion.div key={slot.id} variants={staggerItem}>
              <AvailabilityCard
                availability={slot}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dialog */}
      <AvailabilityFormDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        availability={editing}
        onSubmit={handleSubmit}
        onSubmitBatch={handleSubmitBatch}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}