import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeekdayAvailabilityBar } from '@/features/home/components/WeekdayAvailabilityBar';
import { SpaceCard } from '../components/SpaceCard';
import { SpaceCardSkeleton } from '../components/SpaceCardSkeleton';
import type { Space, PaginatedSpaces } from '../types';
type SpaceWithAvailability = Space & {
  availabilities?: Array<{ day_of_week: number }>;
};

export function SpacesListPage() {
  const [searchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');

  const [filters, setFilters] = useState({
    location: '',
    type: '',
    min_price: '',
    max_price: '',
    capacity: ''
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['spaces', filters],
    queryFn: async () => {
      // التعديل هنا: إضافة /v1
      const { data } = await apiClient.get<PaginatedSpaces>('/spaces', { params: filters });
      return data;
    }
  });

  const filteredSpaces = data?.data?.filter((space: SpaceWithAvailability) => {
    if (selectedDay === null) return true;
    return space.availabilities?.some((a) => Number(a.day_of_week) === Number(selectedDay));
  }) || [];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="size-4 me-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-bold">Explore Spaces</h1>
          <p className="text-muted-foreground mt-1">Find the perfect space for your needs</p>
        </div>

        {/* Weekday Availability Bar */}
        <WeekdayAvailabilityBar />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
              <h2 className="font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                  <Input name="location" placeholder="City, area..." value={filters.location} onChange={handleFilterChange} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Any type</option>
                    <option value="coworking">Coworking</option>
                    <option value="event_hall">Event Hall</option>
                    <option value="studio">Studio</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Min price</label>
                    <Input name="min_price" type="number" placeholder="0" value={filters.min_price} onChange={handleFilterChange} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Max price</label>
                    <Input name="max_price" type="number" placeholder="∞" value={filters.max_price} onChange={handleFilterChange} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Min capacity</label>
                  <Input name="capacity" type="number" placeholder="Any" value={filters.capacity} onChange={handleFilterChange} />
                </div>
                <Button className="w-full" onClick={() => {}}>
                  <Search className="size-4 me-2" /> Search
                </Button>
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className="w-full lg:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SpaceCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20 text-destructive">Failed to load spaces.</div>
            ) : filteredSpaces.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-border">
                <p className="text-lg text-muted-foreground">No spaces found matching your criteria.</p>
                {selectedDay && <p className="text-sm text-muted-foreground mt-2">Try clearing the day filter.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredSpaces.map((space: SpaceWithAvailability) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}