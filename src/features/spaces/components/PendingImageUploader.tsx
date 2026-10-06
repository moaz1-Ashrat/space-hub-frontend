import { useRef, useState, useMemo, useEffect } from 'react';
import { Upload, Trash2, Star, AlertCircle } from 'lucide-react';

interface PendingImageUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function PendingImageUploader({
  files,
  onFilesChange,
  maxImages = 10,
}: PendingImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const canUploadMore = files.length < maxImages;
  const hasFiles = files.length > 0;

  // Create preview URLs
  const previews = useMemo(
    () => files.map((file) => ({ url: URL.createObjectURL(file), name: file.name })),
    [files]
  );

  // Cleanup preview URLs on unmount or change
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, or WebP files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleAdd = (newFiles: File[]) => {
    const valid: File[] = [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        alert(error);
        continue;
      }
      if (files.length + valid.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        break;
      }
      valid.push(file);
    }

    if (valid.length > 0) {
      onFilesChange([...files, ...valid]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    handleAdd(Array.from(selected));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    const dropped = e.dataTransfer.files;
    if (dropped) handleAdd(Array.from(dropped));
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const file = files[index];
    const rest = files.filter((_, i) => i !== index);
    onFilesChange([file, ...rest]);
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
          {files.length} / {maxImages}
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
        </div>
      )}

      {/* Max Warning */}
      {!canUploadMore && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-2 text-sm">
          <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
          <span className="text-warning">
            Maximum {maxImages} images reached. Remove one to add more.
          </span>
        </div>
      )}

      {/* Previews */}
      {hasFiles && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {previews.map((preview, index) => (
            <div
              key={preview.url}
              className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border"
            >
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium flex items-center gap-1">
                  <Star className="size-3 fill-current" />
                  Cover
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="p-2 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Set as cover"
                  >
                    <Star className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-md bg-error/80 hover:bg-error text-white transition-colors"
                  title="Remove"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}