import { Link } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';
import type { Space } from '../types';

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  // Get primary image URL (fallback to first image)
  const coverUrl =
    space.primary_image?.url ?? space.images?.[0]?.url ?? null;

  return (
    <Link
      to={`/spaces/${space.id}`}
      className="group block bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-modal transition-all hover:-translate-y-0.5"
    >
      {/* Cover Image or Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        {coverUrl ? (
          <>
            <img
              src={coverUrl}
              alt={space.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Gradient Overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          // Fallback: Letter placeholder
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-heading font-bold text-primary/40">
              {space.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Image Count Badge */}
        {space.images && space.images.length > 1 && (
          <div className="absolute top-3 end-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            📷 {space.images.length}
          </div>
        )}

        {/* Rating Badge */}
        {space.average_rating && (
          <div className="absolute top-3 start-3 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="size-3 fill-current text-warning" />
            {space.average_rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
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

        {/* Price */}
        <div className="flex items-baseline justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xl font-bold text-primary font-mono">
              {Number(space.price_per_hour).toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground ms-1">
              EGP / hour
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}