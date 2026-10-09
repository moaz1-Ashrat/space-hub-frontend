// src/features/owner/components/OwnerSpaceCard.tsx
import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Space } from '@/features/spaces/types';

interface OwnerSpaceCardProps {
  space: Space;
  onDelete: (id: number) => void;
}

const approvalConfig = {
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/30',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-error/10 text-error border-error/30',
  },
};

export function OwnerSpaceCard({ space, onDelete }: OwnerSpaceCardProps) {
  const config = approvalConfig[space.approval_status];

  const coverUrl =
    space.primary_image?.url ?? space.images?.[0]?.url ?? null;

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${space.name}"? This action cannot be undone.`
      )
    ) {
      onDelete(space.id);
    }
  };

  return (
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
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="size-6 text-primary/30" />
            <span className="text-4xl font-heading font-bold text-primary/40">
              {space.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Approval Badge */}
        <span
          className={`absolute top-3 end-3 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${config.className}`}
        >
          {config.label}
        </span>

        {/* Image Count */}
        {space.images && space.images.length > 0 && (
          <span className="absolute top-3 start-3 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-sm text-white flex items-center gap-1">
            <ImageIcon className="size-3" />
            {space.images.length}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-lg line-clamp-1">
            {space.name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{space.location}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {space.capacity_people}
          </span>
          <span className="capitalize">
            {space.space_type.replace('_', ' ')}
          </span>
        </div>

        <div className="pt-2 border-t border-border">
          <span className="font-mono font-bold text-primary">
            {Number(space.price_per_hour).toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground ms-1">EGP / hour</span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {/* Availability link — Premium style */}
          <Link
            to={`/owner/spaces/${space.id}/availability`}
            className="block"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 hover:border-primary/50 text-primary font-medium shadow-sm transition-all group/btn"
            >
              <span className="flex items-center gap-2">
                <Clock className="size-3.5 transition-transform group-hover/btn:rotate-12" />
                Manage Availability
              </span>
              <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>

          {/* Row: View / Edit / Delete */}
          <div className="flex gap-2">
            <Link to={`/spaces/${space.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="size-3.5" />
                View
              </Button>
            </Link>

            <Link to={`/owner/spaces/${space.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="size-3.5" />
                Edit
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-error border-error/30 hover:bg-error/10"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}