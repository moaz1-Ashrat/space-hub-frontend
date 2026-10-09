// src/features/admin/pages/AdminDashboardPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  UserCog,
  ArrowRight,
  BarChart3,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

import { useDashboard } from '../hooks/useDashboard';
import { DashboardKPICard } from '../components/DashboardKPICard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error
  if (isError || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-7 text-destructive" />
        </div>
        <p className="text-lg font-medium text-destructive">
          Failed to load dashboard
        </p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Something went wrong. Please try again.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </motion.div>
    );
  }

  const stats = data.data;
  const activeBookings = Math.max(
    stats.total_bookings - stats.pending_spaces,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and key metrics
        </p>
      </motion.div>

      {/* Main KPIs */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            title: 'Total Users',
            value: stats.total_users,
            icon: Users,
            color: 'primary',
          },
          {
            title: 'Total Spaces',
            value: stats.total_spaces,
            icon: Building2,
            color: 'info',
          },
          {
            title: 'Total Bookings',
            value: stats.total_bookings,
            icon: Calendar,
            color: 'success',
          },
          {
            title: 'Total Revenue',
            value: stats.total_revenue,
            icon: DollarSign,
            color: 'warning',
            suffix: 'EGP',
            formatted: true,
          },
        ].map((kpi, i) => (
          <motion.div key={i} variants={staggerItem}>
            <DashboardKPICard {...(kpi as any)} />
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary KPIs */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            title: 'Customers',
            value: stats.total_customers,
            icon: UserCheck,
            color: 'info',
          },
          {
            title: 'Owners',
            value: stats.total_owners,
            icon: UserCog,
            color: 'primary',
          },
          {
            title: 'Pending Approvals',
            value: stats.pending_spaces,
            icon: Clock,
            color: 'warning',
          },
          {
            title: 'Active Bookings',
            value: activeBookings,
            icon: TrendingUp,
            color: 'success',
          },
        ].map((kpi, i) => (
          <motion.div key={i} variants={staggerItem}>
            <DashboardKPICard {...(kpi as any)} />
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
            to="/admin/spaces/pending"
            className="group block bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Clock className="size-6" />
              </div>
              {stats.pending_spaces > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold">
                  {stats.pending_spaces} pending
                </span>
              )}
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              Review Pending Spaces
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {stats.pending_spaces > 0
                ? `${stats.pending_spaces} space${stats.pending_spaces === 1 ? '' : 's'} awaiting your approval`
                : 'No spaces awaiting approval right now'}
            </p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Review now</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Link
            to="/admin/analytics"
            className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="size-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              View Analytics
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Revenue trends, user growth, and platform insights
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span>Explore analytics</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}