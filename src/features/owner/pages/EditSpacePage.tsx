import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ownerService } from '../services/ownerService';
import { useUpdateSpace } from '../hooks/useUpdateSpace';
import { SpaceForm } from '../components/SpaceForm';
import apiClient from '@/lib/axios';
import type { SpaceFeature } from '@/features/spaces/types';
import type { SpaceFormData } from '../types';

export function EditSpacePage() {
  const { id } = useParams<{ id: string }>();
  const spaceId = Number(id);
  const updateMutation = useUpdateSpace();
  const [features, setFeatures] = useState<SpaceFeature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['owner', 'space', spaceId],
    queryFn: () => ownerService.showSpace(spaceId),
    enabled: !!spaceId,
  });

  useEffect(() => {
    apiClient
      .get('/features')
      .then((res) => {
        setFeatures(res.data.data ?? []);
      })
      .catch((err) => {
        console.error('Failed to load features:', err);
        setFeatures([]);
      })
      .finally(() => {
        setFeaturesLoading(false);
      });
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

  if (isLoading || featuresLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-xl font-medium">Space not found</p>
        <Link
          to="/owner/spaces"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Back to spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/owner/spaces"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to spaces
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-bold">Edit Space</h1>
        <p className="text-muted-foreground mt-1">{data.data.name}</p>
      </div>

      <SpaceForm
        mode="edit"
        initialData={data.data}
        availableFeatures={features}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}