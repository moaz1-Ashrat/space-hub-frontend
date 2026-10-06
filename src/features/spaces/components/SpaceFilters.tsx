import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SpaceFilters as Filters } from '../types';

interface SpaceFiltersProps {
  onFilter: (filters: Filters) => void;
  initialFilters?: Filters;
}

const SPACE_TYPES = ['office', 'hall', 'studio', 'garage', 'gaming_lounge', 'billiard_hall'];

export function SpaceFilters({ onFilter, initialFilters = {} }: SpaceFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({});
    onFilter({});
  };

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold">Filters</h3>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-error flex items-center gap-1"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Location</label>
          <Input
            placeholder="City, area..."
            value={filters.location ?? ''}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.type ?? ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
          >
            <option value="">Any type</option>
            {SPACE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Min price</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.min_price ?? ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  min_price: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Max price</label>
            <Input
              type="number"
              placeholder="∞"
              value={filters.max_price ?? ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  max_price: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Min capacity</label>
          <Input
            type="number"
            placeholder="Any"
            value={filters.capacity ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                capacity: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );
}