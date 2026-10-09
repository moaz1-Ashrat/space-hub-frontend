// src/features/customer/pages/CustomerOverviewPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { BookingStatusBadge } from '@/features/bookings/components/BookingStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function CustomerOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: bookingsData, isLoading } = useBookings(1);

  const bookings = bookingsData?.data ?? [];
  const totalBookings = bookingsData?.meta.total ?? 0;
  const pendingBookings = bookings.filter((b) => b.booking_status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.booking_status === 'completed').length;

  const recentBookings = bookings.slice(0, 4);

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
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your bookings and activity
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
            icon: Calendar,
            color: 'primary',
            value: totalBookings,
            label: 'Total Bookings',
            to: '/customer/bookings',
          },
          {
            icon: Clock,
            color: 'warning',
            value: pendingBookings,
            label: 'Pending',
            to: '/customer/bookings',
          },
          {
            icon: CheckCircle2,
            color: 'success',
            value: confirmedBookings,
            label: 'Confirmed',
            to: '/customer/bookings',
          },
          {
            icon: CreditCard,
            color: 'info',
            value: completedBookings,
            label: 'Completed',
            to: '/customer/bookings',
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
                  <div className="text-2xl font-bold font-mono">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
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
            to="/spaces"
            className="group block bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-3">
              <Search className="size-6" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              Browse Spaces
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Find your next booking across Egypt
            </p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Explore now</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Link
            to="/customer/bookings"
            className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Calendar className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              My Bookings
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              View, pay for, and manage your bookings
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span>View bookings</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">Recent Bookings</h2>
          <Link
            to="/customer/bookings"
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
              Start exploring spaces and make your first booking
            </p>
            <Link
              to="/spaces"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Search className="size-4" />
              Browse Spaces
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
                  to={`/customer/bookings/${booking.id}`}
                  className="block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
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
                    <div className="font-mono font-bold text-primary shrink-0">
                      {Number(booking.total_amount).toFixed(2)} EGP
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