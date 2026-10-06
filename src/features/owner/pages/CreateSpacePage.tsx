import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateSpace } from '../hooks/useCreateSpace';
import { SpaceForm } from '../components/SpaceForm';
import apiClient from '@/lib/axios';
import { spaceService } from '@/features/spaces/services/spaceService';
import type { SpaceFeature } from '@/features/spaces/types';
import type { SpaceFormData } from '../types';

export function CreateSpacePage() {
  const navigate = useNavigate();
  const createMutation = useCreateSpace();
  const [features, setFeatures] = useState<SpaceFeature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [pendingImages, setPendingImages] = useState<File[]>([]);

  useEffect(() => {
    apiClient
      .get('/features')
      .then((res) => setFeatures(res.data.data ?? []))
      .catch(() => setFeatures([]))
      .finally(() => setFeaturesLoading(false));
  }, []);

  const handleSubmit = async (data: SpaceFormData) => {
    try {
      // 1. Create Space
      const result = await createMutation.mutateAsync({
        ...data,
        feature_ids: data.feature_ids ?? [],
      });

      const spaceId = result.data.id;

      // 2. Upload pending images (if any)
      if (pendingImages.length > 0) {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < pendingImages.length; i++) {
          try {
            await spaceService.uploadImage(
              spaceId,
              pendingImages[i],
              i === 0 // First image is primary
            );
            successCount++;
          } catch (err) {
            console.error('Image upload failed:', err);
            failCount++;
          }
        }

        if (failCount > 0) {
          toast.warning(
            `${successCount} photos uploaded, ${failCount} failed. You can retry in edit page.`
          );
        } else {
          toast.success(`${successCount} photo(s) uploaded`);
        }
      }

      // 3. Redirect
      navigate('/owner/spaces');
    } catch {
      // Error already handled by mutation's onError
    }
  };

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
        <h1 className="text-3xl font-heading font-bold">Create New Space</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to list your space
        </p>
      </div>

      {featuresLoading ? (
        <div className="h-96 bg-muted animate-pulse rounded-xl" />
      ) : (
        <SpaceForm
          mode="create"
          availableFeatures={features}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          pendingImages={pendingImages}
          onPendingImagesChange={setPendingImages}
        />
      )}
    </div>
  );
}