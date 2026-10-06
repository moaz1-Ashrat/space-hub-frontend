import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader } from '@/features/spaces/components/ImageUploader';
import { PendingImageUploader } from '@/features/spaces/components/PendingImageUploader';
import type { SpaceFormData } from '../types';
import type { Space, SpaceFeature } from '@/features/spaces/types';

const SPACE_TYPES = [
  'office',
  'hall',
  'studio',
  'garage',
  'gaming_lounge',
  'billiard_hall',
];

const spaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  location: z.string().min(1, 'Location is required').max(255),
  description: z.string().optional(),
  space_size: z.string().min(1, 'Size is required').max(50),
  capacity_people: z.coerce.number().min(1, 'At least 1 person'),
  price_per_hour: z.coerce.number().min(0, 'Must be 0 or more'),
  space_type: z.string().min(1, 'Type is required'),
  device_type: z.string().optional(),
  feature_ids: z.array(z.number()).optional(),
});

interface SpaceFormProps {
  mode: 'create' | 'edit';
  initialData?: Space;
  availableFeatures: SpaceFeature[];
  onSubmit: (data: SpaceFormData) => void | Promise<void>;
  isSubmitting: boolean;
  pendingImages?: File[];
  onPendingImagesChange?: (files: File[]) => void;
}

export function SpaceForm({
  mode,
  initialData,
  availableFeatures,
  onSubmit,
  isSubmitting,
  pendingImages = [],
  onPendingImagesChange,
}: SpaceFormProps) {
  const form = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema) as any,
    defaultValues: {
      name: '',
      location: '',
      description: '',
      space_size: '',
      capacity_people: 1,
      price_per_hour: 0,
      space_type: 'studio',
      device_type: '',
      feature_ids: [],
    },
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      form.reset({
        name: initialData.name,
        location: initialData.location,
        description: initialData.description ?? '',
        space_size: initialData.space_size,
        capacity_people: initialData.capacity_people,
        price_per_hour: Number(initialData.price_per_hour),
        space_type: initialData.space_type,
        device_type: initialData.device_type ?? '',
        feature_ids: initialData.features.map((f) => f.id),
      });
    }
  }, [mode, initialData, form]);

  const selectedFeatureIds = form.watch('feature_ids') ?? [];

  const toggleFeature = (featureId: number) => {
    const current = selectedFeatureIds;
    const updated = current.includes(featureId)
      ? current.filter((id) => id !== featureId)
      : [...current, featureId];
    form.setValue('feature_ids', updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading font-semibold text-lg">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Downtown Studio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Main St, Cairo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <textarea
                    rows={4}
                    placeholder="Describe your space..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Space Details */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading font-semibold text-lg">Space Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="space_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Type</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      {...field}
                    >
                      {SPACE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="space_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 80 sqm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity_people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (people)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_per_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Hour (EGP)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="device_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Devices (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Projector, Sound System" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Features */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-heading font-semibold text-lg">Features</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select all features available in your space
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableFeatures.map((feature) => {
              const isSelected = selectedFeatureIds.includes(feature.id);
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {feature.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-card border border-border rounded-xl p-6">
          {mode === 'edit' && initialData ? (
            <ImageUploader
              spaceId={initialData.id}
              images={initialData.images ?? []}
              maxImages={10}
            />
          ) : (
            <PendingImageUploader
              files={pendingImages}
              onFilesChange={onPendingImagesChange ?? (() => {})}
              maxImages={10}
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Space'
              : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}