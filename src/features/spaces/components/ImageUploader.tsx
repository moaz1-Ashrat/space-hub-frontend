import { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadImage } from '../hooks/useUploadImage';
import { useDeleteImage } from '../hooks/useDeleteImage';
import { useSetPrimaryImage } from '../hooks/useSetPrimaryImage';
import type { SpaceImage } from '../types';

interface ImageUploaderProps {
  spaceId: number;
  images: SpaceImage[];
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ImageUploader({
  spaceId,
  images,
  maxImages = 10,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();
  const setPrimaryMutation = useSetPrimaryImage();

  const canUploadMore = images.length < maxImages;
  const hasImages = images.length > 0;

  // ============================================
  // Validate file
  // ============================================
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, or WebP files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  // ============================================
  // Handle upload
  // ============================================
  const handleUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    const isPrimary = !hasImages; // first image is primary
    await uploadMutation.mutateAsync({ spaceId, file, isPrimary });
  };

  // ============================================
  // Handle file input change
  // ============================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => handleUpload(file));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // Handle drag & drop
  // ============================================
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    Array.from(files).forEach((file) => handleUpload(file));
  };

  // ============================================
  // Handle delete
  // ============================================
  const handleDelete = (imageId: number) => {
    if (confirm('Delete this image?')) {
      deleteMutation.mutate({ imageId, spaceId });
    }
  };

  // ============================================
  // Handle set primary
  // ============================================
  const handleSetPrimary = (imageId: number) => {
    setPrimaryMutation.mutate({ imageId, spaceId });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-lg">Photos</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add up to {maxImages} images. First image becomes the cover.
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Drop Zone */}
      {canUploadMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="size-5 text-primary" />
              </div>
              <p className="font-medium">
                {isDragging ? 'Drop images here' : 'Click or drag images'}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP · Max 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Max Limit Warning */}
      {!canUploadMore && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2 text-sm">
          <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
          <span className="text-warning">
            Maximum {maxImages} images reached. Delete one to upload more.
          </span>
        </div>
      )}

      {/* Images Grid */}
      {hasImages && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border"
            >
              {/* Image */}
              <img
                src={image.url}
                alt={`Space image ${image.id}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium flex items-center gap-1">
                  <Star className="size-3 fill-current" />
                  Cover
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={setPrimaryMutation.isPending}
                    className="p-2 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Set as cover"
                  >
                    <Star className="size-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-md bg-error/80 hover:bg-error text-white transition-colors"
                  title="Delete"
                >
                  {deleteMutation.isPending &&
                  deleteMutation.variables?.imageId === image.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!hasImages && (
        <div className="p-6 text-center bg-muted/30 rounded-lg border border-border">
          <ImageIcon className="size-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No images yet. Upload your first photo above.
          </p>
        </div>
      )}
    </div>
  );
}