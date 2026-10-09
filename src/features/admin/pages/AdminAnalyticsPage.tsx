// src/features/admin/pages/AdminAnalyticsPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
} from 'lucide-react';

import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { DashboardKPICard } from '../components/DashboardKPICard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function AdminAnalyticsPage() {
  const {
    data: dashData,
    isLoading: dashLoading,
    isError: dashError,
    refetch: refetchDash,
  } = useDashboard();
  const { data: transData, isLoading: transLoading } = useTransactions({
    status: 'paid',
    page: 1,
  });

  // Loading
  if (dashLoading || transLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  // Error
  if (dashError || !dashData?.data) {
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
          Failed to load analytics
        </p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Something went wrong. Please try again.
        </p>
        <Button variant="outline" onClick={() => refetchDash()}>
          Try Again
        </Button>
      </motion.div>
    );
  }

  const stats = dashData.data;
  const payments = transData?.data ?? [];

  const avgBookingValue =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / payments.length
      : 0;

  const completionRate =
    stats.total_bookings > 0
      ? ((stats.total_bookings - stats.pending_spaces) / stats.total_bookings) *
        100
      : 0;

  const activeBookings = Math.max(
    stats.total_bookings - stats.pending_spaces,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <BarChart3 className="size-7 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform growth and performance insights
        </p>
      </motion.div>

      {/* Platform Growth */}
      <div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg font-heading font-semibold mb-3 flex items-center gap-2"
        >
          <TrendingUp className="size-5 text-primary" />
          Platform Growth
        </motion.h2>
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
              title: 'Revenue',
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
      </div>

      {/* Performance Metrics */}
      <div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg font-heading font-semibold mb-3 flex items-center gap-2"
        >
          <Activity className="size-5 text-info" />
          Performance Metrics
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Avg Booking Value */}
          <motion.div
            variants={staggerItem}
            className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
          >
            <div className="absolute top-0 end-0 w-32 h-32 bg-success/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="size-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Avg. Booking Value
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-success">
                {avgBookingValue.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                EGP per paid booking
              </div>
            </div>
          </motion.div>

          {/* Completion Rate */}
          <motion.div
            variants={staggerItem}
            className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
          >
            <div className="absolute top-0 end-0 w-32 h-32 bg-info/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <TrendingUp className="size-4 text-info" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Completion Rate
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-info">
                {completionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Non-pending bookings
              </div>
            </div>
          </motion.div>

          {/* Active Bookings */}
          <motion.div
            variants={staggerItem}
            className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
          >
            <div className="absolute top-0 end-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="size-4 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Pending Approvals
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-warning">
                {stats.pending_spaces}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {activeBookings} active bookings
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Distribution Section */}
      <div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg font-heading font-semibold mb-3 flex items-center gap-2"
        >
          <PieChart className="size-5 text-secondary" />
          User Distribution
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              label: 'Customers',
              value: stats.total_customers,
              total: stats.total_users,
              color: 'bg-primary',
            },
            {
              label: 'Owners',
              value: stats.total_owners,
              total: stats.total_users,
              color: 'bg-secondary',
            },
            {
              label: 'Admins',
              value: stats.total_users - stats.total_customers - stats.total_owners,
              total: stats.total_users,
              color: 'bg-warning',
            },
          ].map((item, i) => {
            const pct = item.total > 0 ? (item.value / item.total) * 100 : 0;
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-5 rounded-xl bg-card border border-border"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-2xl font-bold font-mono">
                    {item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {pct.toFixed(1)}% of total users
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Payments */}
      <div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-3"
        >
          <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
            <DollarSign className="size-5 text-success" />
            Recent Payments
          </h2>
          <Link
            to="/admin/transactions"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>

        {payments.length === 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="p-12 text-center bg-card border border-border rounded-xl"
          >
            <DollarSign className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg font-medium">No payment data yet</p>
            <p className="text-muted-foreground mt-1">
              Payments will appear here as customers complete bookings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border"
          >
            {payments.slice(0, 5).map((p) => (
              <motion.div
                key={p.id}
                variants={staggerItem}
                className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <DollarSign className="size-4 text-success" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {p.customer_name ?? 'Unknown customer'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.payment_methode ?? 'method unknown'} •{' '}
                      {p.payment_date_time
                        ? new Date(p.payment_date_time).toLocaleDateString(
                            'en-GB'
                          )
                        : 'no date'}
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-primary shrink-0">
                  {Number(p.amount).toFixed(2)} EGP
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}