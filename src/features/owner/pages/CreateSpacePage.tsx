// src/features/owner/pages/CreateSpacePage.tsx
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

      // 2. Upload pending images (silent — no individual toasts)
      let uploadedImages = 0;
      let failedImages = 0;

      if (pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          try {
            await spaceService.uploadImage(
              spaceId,
              pendingImages[i],
              i === 0 // First image is primary
            );
            uploadedImages++;
          } catch (err) {
            console.error('Image upload failed:', err);
            failedImages++;
          }
        }
      }

      // 3. SINGLE consolidated toast (prevents stacking)
      const imageInfo =
        uploadedImages > 0
          ? ` ${uploadedImages} photo${uploadedImages === 1 ? '' : 's'} uploaded.`
          : '';

      const failInfo =
        failedImages > 0
          ? ` ${failedImages} image${failedImages === 1 ? '' : 's'} failed — retry in edit page.`
          : '';

      toast.success('Space created successfully!', {
        id: 'space-created', // ✅ prevents duplicate stacking
        description: `Now add availability so customers can book it.${imageInfo}${failInfo}`,
        duration: 5000,
      });

      // 4. Redirect to Availability page
      navigate(`/owner/spaces/${spaceId}/availability`, {
        state: { isNewSpace: true },
      });
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
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
          <strong>💡 Next step:</strong> After creating, you'll set up the
          weekly availability so customers can book your space.
        </div>
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