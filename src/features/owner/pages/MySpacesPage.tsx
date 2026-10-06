import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useOwnerSpaces } from '../hooks/useOwnerSpaces';
import { useDeleteSpace } from '../hooks/useDeleteSpace';
import { OwnerSpaceCard } from '../components/OwnerSpaceCard';
import { Button } from '@/components/ui/button';

export function MySpacesPage() {
  const { data, isLoading, isError } = useOwnerSpaces();
  const deleteMutation = useDeleteSpace();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Spaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your listed spaces
          </p>
        </div>

        <Link to="/owner/spaces/create">
          <Button>
            <Plus className="size-4" />
            Add New Space
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
          <p className="text-error">Failed to load spaces</p>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-lg font-medium">No spaces yet</p>
          <p className="text-muted-foreground mt-1 mb-4">
            Start by creating your first space listing
          </p>
          <Link to="/owner/spaces/create">
            <Button>
              <Plus className="size-4" />
              Create Your First Space
            </Button>
          </Link>
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((space) => (
            <OwnerSpaceCard
              key={space.id}
              space={space}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}