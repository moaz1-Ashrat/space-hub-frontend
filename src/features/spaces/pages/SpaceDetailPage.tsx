import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Star,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { useSpace } from '../hooks/useSpace';
import { useSpaceAvailability } from '../hooks/useSpaceAvailability';
import { AvailabilityPreview } from '../components/AvailabilityPreview';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';
import { BookingFormDialog } from '@/features/bookings/components/BookingFormDialog';

export function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const spaceId = Number(id);
  const { data, isLoading, isError } = useSpace(spaceId);
  const { data: availabilityData, isLoading: isAvailabilityLoading } =
    useSpaceAvailability(spaceId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const dashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'space_owner') return '/owner';
    return '/customer';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-xl font-medium">Space not found</p>
        <Link
          to="/spaces"
          className="text-primary hover:underline mt-2 inline-block"
        >
          Back to spaces
        </Link>
      </div>
    );
  }

  const space = data.data;
  const isCustomer = user?.role === 'customer';

  const images = space.images ?? [];
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.order - b.order;
  });
  const hasImages = sortedImages.length > 0;
  const activeImage = sortedImages[activeImageIndex];

  const availabilityList = availabilityData?.data ?? [];
  const activeSlots = availabilityList.filter((a) => a.is_available);
  const hasAvailability = activeSlots.length > 0;

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isCustomer) return;
    setShowBookingForm(true);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
        <Link
          to={isAuthenticated && user ? dashboardPath() : '/'}
          className="hover:text-primary transition-colors"
        >
          {isAuthenticated ? 'Dashboard' : 'Home'}
        </Link>
        <span>/</span>
        <Link to="/spaces" className="hover:text-primary transition-colors">
          Spaces
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {space.name}
        </span>
      </nav>

      {/* Image Gallery */}
      {hasImages ? (
        <div className="mb-6 space-y-3">
          <div className="aspect-[16/9] bg-muted rounded-xl overflow-hidden border border-border">
            <img
              src={activeImage.url}
              alt={`${space.name} - Image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {sortedImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeImageIndex
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {image.is_primary && (
                    <div className="absolute top-1 start-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Star className="size-2.5 fill-current text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex flex-col items-center justify-center mb-6 border border-border">
          <ImageIcon className="size-16 text-primary/30 mb-3" />
          <span className="text-2xl font-heading font-bold text-primary/40">
            {space.name}
          </span>
          <p className="text-sm text-muted-foreground mt-2">
            No photos available yet
          </p>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About + Features Card */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-heading font-bold">{space.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="size-4" />
                {space.location}
              </p>
            </div>

            {space.description && (
              <div>
                <h3 className="font-heading font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {space.description}
                </p>
              </div>
            )}

            {space.features.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {space.features.map((feature) => (
                    <span
                      key={feature.id}
                      className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm border border-secondary/30 font-medium"
                    >
                      {feature.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ✅ NEW: Availability Preview Card */}
          <div className="bg-card border border-border rounded-xl p-6">
            {isAvailabilityLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
            ) : (
              <AvailabilityPreview availability={availabilityList} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6 sticky top-20">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary font-mono">
                  {Number(space.price_per_hour).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">EGP / hour</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="size-3.5" />
                  {space.capacity_people} people
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{space.space_size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">
                  {space.space_type.replace('_', ' ')}
                </span>
              </div>
              {space.average_rating && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium flex items-center gap-1 text-warning">
                    <Star className="size-3.5 fill-current" />
                    {space.average_rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Availability status indicator */}
            {!isAvailabilityLoading && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  hasAvailability
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-warning/10 text-warning border border-warning/20'
                }`}
              >
                <Calendar className="size-4 shrink-0" />
                <span className="font-medium">
                  {hasAvailability
                    ? `${activeSlots.length} time slot${activeSlots.length === 1 ? '' : 's'} available`
                    : 'No time slots yet'}
                </span>
              </div>
            )}

            <Button
              className="w-full"
              disabled={
                (isAuthenticated && !isCustomer) ||
                (!isAvailabilityLoading && !hasAvailability && isCustomer)
              }
              onClick={handleBookClick}
            >
              {!isAuthenticated
                ? 'Login to book'
                : !isCustomer
                ? 'Only customers can book'
                : !hasAvailability
                ? 'Not available for booking'
                : 'Book Now'}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{' '}
                to make a booking
              </p>
            )}

            {isAuthenticated && !isCustomer && (
              <p className="text-xs text-center text-muted-foreground">
                Only customer accounts can make bookings
              </p>
            )}

            {isAuthenticated &&
              isCustomer &&
              !isAvailabilityLoading &&
              !hasAvailability && (
                <p className="text-xs text-center text-muted-foreground">
                  The owner hasn't set up availability yet
                </p>
              )}
          </div>
        </aside>
      </div>

      {/* Booking Form Dialog */}
      {showBookingForm && (
        <BookingFormDialog
          spaceId={space.id}
          spaceName={space.name}
          pricePerHour={Number(space.price_per_hour)}
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}