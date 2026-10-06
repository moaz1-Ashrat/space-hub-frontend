import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useOwnerSpaces } from '../hooks/useOwnerSpaces';
import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';

export function OwnerOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: spacesData, isLoading: spacesLoading } = useOwnerSpaces();
  const { data: bookingsData, isLoading: bookingsLoading } = useOwnerBookings(1);

  const spaces = spacesData?.data ?? [];
  const bookings = bookingsData?.data ?? [];

  const approvedSpaces = spaces.filter((s) => s.approval_status === 'approved').length;
  const pendingSpaces = spaces.filter((s) => s.approval_status === 'pending').length;

  const totalEarnings = bookings
    .filter((b) => b.booking_status === 'completed' || b.booking_status === 'confirmed')
    .reduce((sum, b) => sum + (b.owner_payout ?? 0), 0);

  const pendingBookings = bookings.filter((b) => b.booking_status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'confirmed').length;

  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Welcome, {user?.name?.split(' ')[0]} 🏢
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your spaces and track earnings
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{spaces.length}</div>
              <div className="text-xs text-muted-foreground">Total Spaces</div>
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
              <div className="text-xs text-muted-foreground">Pending Bookings</div>
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
              <DollarSign className="size-5 text-info" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">
                {totalEarnings.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Payout (EGP)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/owner/spaces/create"
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:opacity-95 transition-opacity"
        >
          <Plus className="size-8 mb-2" />
          <h3 className="text-xl font-heading font-semibold mb-1">Add New Space</h3>
          <p className="text-white/80 text-sm mb-3">
            List a new space and start earning
          </p>
          <ArrowRight className="size-5" />
        </Link>

        <Link
          to="/owner/bookings"
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
        >
          <Calendar className="size-8 text-primary mb-2" />
          <h3 className="text-xl font-heading font-semibold mb-1">
            Manage Bookings
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            Confirm and track incoming bookings
          </p>
          <ArrowRight className="size-5 text-primary" />
        </Link>
      </div>

      {/* Spaces Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm text-muted-foreground">Approved Spaces</div>
          <div className="text-3xl font-bold font-mono text-success mt-1">
            {approvedSpaces}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm text-muted-foreground">Pending Approval</div>
          <div className="text-3xl font-bold font-mono text-warning mt-1">
            {pendingSpaces}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">Recent Bookings</h2>
          <Link
            to="/owner/bookings"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {bookingsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-xl">
            <p className="text-lg font-medium">No bookings yet</p>
            <p className="text-muted-foreground mt-1">
              Bookings on your spaces will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-xl p-4"
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
                  <div className="text-right">
                    <div className="font-mono font-bold text-success">
                      +{Number(booking.owner_payout ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Your Payout</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}