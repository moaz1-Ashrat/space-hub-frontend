// src/features/owner/pages/EditSpacePage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

import { ownerService } from '../services/ownerService';
import { useUpdateSpace } from '../hooks/useUpdateSpace';
import { SpaceForm } from '../components/SpaceForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/axios';
import type { SpaceFeature } from '@/features/spaces/types';
import type { SpaceFormData } from '../types';

export function EditSpacePage() {
  const { id } = useParams<{ id: string }>();
  const spaceId = Number(id);
  const updateMutation = useUpdateSpace();
  const [features, setFeatures] = useState<SpaceFeature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['owner', 'space', spaceId],
    queryFn: () => ownerService.showSpace(spaceId),
    enabled: !!spaceId,
  });

  useEffect(() => {
    apiClient
      .get('/features')
      .then((res) => setFeatures(res.data.data ?? []))
      .catch((err) => {
        console.error('Failed to load features:', err);
        setFeatures([]);
      })
      .finally(() => setFeaturesLoading(false));
  }, []);

  const handleSubmit = async (formData: SpaceFormData) => {
    await updateMutation.mutateAsync({
      id: spaceId,
      payload: {
        ...formData,
        feature_ids: formData.feature_ids ?? [],
      },
    });
  };

  // Loading
  if (isLoading || featuresLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <Skeleton className="h-5 w-40" />
        <div>
          <Skeleton className="h-9 w-56 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  // Error / Not found
  if (isError || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-16 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <p className="text-xl font-heading font-semibold mb-1">
          Space not found
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          The space you're trying to edit doesn't exist or you don't have access
          to it.
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button asChild>
            <Link to="/owner/spaces">
              <ArrowLeft className="size-4 me-2" />
              Back to My Spaces
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to="/owner/spaces"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to spaces
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Building2 className="size-7 text-primary" />
          Edit Space
        </h1>
        <p className="text-muted-foreground mt-1">{data.data.name}</p>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl bg-info/5 border border-info/20 text-sm">
        <p className="font-medium mb-1">💡 Note</p>
        <p className="text-muted-foreground">
          Changes to your space details will be saved immediately. If you
          change the space name or location, it will update for all future
          bookings and searches.
        </p>
      </div>

      <SpaceForm
        mode="edit"
        initialData={data.data}
        availableFeatures={features}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </motion.div>
  );
}