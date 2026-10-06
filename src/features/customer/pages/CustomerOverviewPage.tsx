import { Link } from 'react-router-dom';
import { Calendar, CreditCard, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';

export function CustomerOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: bookingsData, isLoading } = useBookings(1);

  const bookings = bookingsData?.data ?? [];
  const totalBookings = bookingsData?.meta.total ?? 0;
  const pendingBookings = bookings.filter((b) => b.booking_status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.booking_status === 'completed').length;

  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your bookings and activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{totalBookings}</div>
              <div className="text-xs text-muted-foreground">Total Bookings</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="size-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{pendingBookings}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="size-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{confirmedBookings}</div>
              <div className="text-xs text-muted-foreground">Confirmed</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <CreditCard className="size-5 text-info" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{completedBookings}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/spaces"
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:opacity-95 transition-opacity"
        >
          <h3 className="text-xl font-heading font-semibold mb-1">Browse Spaces</h3>
          <p className="text-white/80 text-sm mb-3">Find your next booking</p>
          <ArrowRight className="size-5" />
        </Link>

        <Link
          to="/customer/bookings"
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
        >
          <h3 className="text-xl font-heading font-semibold mb-1">My Bookings</h3>
          <p className="text-muted-foreground text-sm mb-3">View and manage bookings</p>
          <ArrowRight className="size-5 text-primary" />
        </Link>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">Recent Bookings</h2>
          <Link
            to="/customer/bookings"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <p className="text-lg font-medium">No bookings yet</p>
            <p className="text-muted-foreground mt-1 mb-4">
              Start exploring spaces and make your first booking
            </p>
            <Link to="/spaces">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90">
                Browse Spaces
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id}
                to={`/customer/bookings/${booking.id}`}
                className="block bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{booking.space.name}</h3>
                      <BookingStatusBadge status={booking.booking_status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(booking.start_datetime).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="font-mono font-bold text-primary">
                    {Number(booking.total_amount).toFixed(2)} EGP
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}