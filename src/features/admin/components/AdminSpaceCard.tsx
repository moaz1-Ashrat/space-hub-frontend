import { Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Space } from '@/features/spaces/types';

interface AdminSpaceCardProps {
  space: Space;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function AdminSpaceCard({
  space,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: AdminSpaceCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Cover */}
        <div className="md:w-56 aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative shrink-0">
          <span className="text-4xl font-heading font-bold text-primary/40">
            {space.name.charAt(0)}
          </span>
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-warning/10 text-warning border-warning/30 flex items-center gap-1">
            <Clock className="size-3" />
            Pending
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3">
          <div>
            <h3 className="font-heading font-semibold text-lg">
              {space.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-3.5 shrink-0" />
              <span className="line-clamp-1">{space.location}</span>
            </p>
          </div>

          {space.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {space.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {space.capacity_people} people
            </span>
            <span className="capitalize">
              {space.space_type.replace('_', ' ')}
            </span>
            <span className="font-mono text-primary font-semibold">
              {Number(space.price_per_hour).toFixed(2)} EGP/h
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Owner: <span className="font-medium">{space.owner_name}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              size="sm"
              onClick={() => onApprove(space.id)}
              disabled={isApproving}
            >
              <CheckCircle className="size-3.5" />
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(space.id)}
              disabled={isRejecting}
              className="text-error border-error/30 hover:bg-error/10"
            >
              <XCircle className="size-3.5" />
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </Button>

            <Link to={`/spaces/${space.id}`} className="ms-auto">
              <Button variant="ghost" size="sm">
                <Eye className="size-3.5" />
                Preview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}