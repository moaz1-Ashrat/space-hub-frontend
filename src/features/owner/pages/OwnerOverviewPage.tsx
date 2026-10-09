// src/features/owner/pages/OwnerOverviewPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { useOwnerSpaces } from '../hooks/useOwnerSpaces';
import { useOwnerBookings } from '../hooks/useOwnerBookings';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function OwnerOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: spacesData, isLoading: spacesLoading } = useOwnerSpaces();
  const { data: bookingsData, isLoading: bookingsLoading } = useOwnerBookings(1);

  const isLoading = spacesLoading || bookingsLoading;

  const spaces = spacesData?.data ?? [];
  const bookings = bookingsData?.data ?? [];

  const approvedSpaces = spaces.filter(
    (s) => s.approval_status === 'approved'
  ).length;
  const pendingSpaces = spaces.filter(
    (s) => s.approval_status === 'pending'
  ).length;

  const totalEarnings = bookings
    .filter(
      (b) =>
        b.booking_status === 'completed' || b.booking_status === 'confirmed'
    )
    .reduce((sum, b) => sum + (b.owner_payout ?? 0), 0);

  const pendingBookings = bookings.filter(
    (b) => b.booking_status === 'pending'
  ).length;
  const confirmedBookings = bookings.filter(
    (b) => b.booking_status === 'confirmed'
  ).length;

  const recentBookings = bookings.slice(0, 4);

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          Welcome, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your spaces and track earnings
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Building2,
            color: 'primary',
            value: spaces.length,
            label: 'Total Spaces',
            to: '/owner/spaces',
          },
          {
            icon: Clock,
            color: 'warning',
            value: pendingBookings,
            label: 'Pending Bookings',
            to: '/owner/bookings',
          },
          {
            icon: CheckCircle2,
            color: 'success',
            value: confirmedBookings,
            label: 'Confirmed',
            to: '/owner/bookings',
          },
          {
            icon: DollarSign,
            color: 'info',
            value: `${totalEarnings.toFixed(0)}`,
            label: 'Total Payout (EGP)',
            to: '/owner/earnings',
          },
        ].map((kpi, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Link
              to={kpi.to}
              className="block bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-${kpi.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <kpi.icon className={`size-5 text-${kpi.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono">
                    {kpi.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {kpi.label}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div variants={staggerItem}>
          <Link
            to="/owner/spaces/create"
            className="group block bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Plus className="size-6" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              Add New Space
            </h3>
            <p className="text-white/80 text-sm mb-4">
              List a new space and start earning today
            </p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Create space</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Link
            to="/owner/bookings"
            className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="size-6 text-primary" />
              </div>
              {pendingBookings > 0 && (
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold">
                  {pendingBookings} new
                </span>
              )}
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              Manage Bookings
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Confirm and track incoming bookings on your spaces
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span>View bookings</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Spaces Status */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden bg-card border border-border rounded-xl p-5"
        >
          <div className="absolute top-0 end-0 w-32 h-32 bg-success/5 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Approved Spaces
              </div>
              <div className="text-3xl font-bold font-mono text-success">
                {approvedSpaces}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="size-6 text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden bg-card border border-border rounded-xl p-5"
        >
          <div className="absolute top-0 end-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Pending Approval
              </div>
              <div className="text-3xl font-bold font-mono text-warning">
                {pendingSpaces}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="size-6 text-warning" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Recent Bookings
          </h2>
          <Link
            to="/owner/bookings"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-xl">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
            >
              <Sparkles className="size-8 text-primary" />
            </motion.div>
            <p className="text-lg font-heading font-semibold mb-1">
              No bookings yet
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Bookings on your spaces will appear here
            </p>
            <Link
              to="/owner/spaces"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <Building2 className="size-4" />
              Manage your spaces
            </Link>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {recentBookings.map((booking) => (
              <motion.div key={booking.id} variants={staggerItem}>
                <Link
                  to="/owner/bookings"
                  className="block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">
                          {booking.space.name}
                        </h3>
                        <BookingStatusBadge status={booking.booking_status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(booking.start_datetime).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ms-4">
                      <div className="font-mono font-bold text-success">
                        +{Number(booking.owner_payout ?? 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your Payout
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}