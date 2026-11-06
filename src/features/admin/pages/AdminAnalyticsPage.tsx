// src/features/admin/pages/AdminAnalyticsPage.tsx
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
  UserCheck,
  Layers,
  CheckCircle2,  // ← جديد
  XCircle,       // ← جديد
  Clock,
  Ticket,
} from 'lucide-react';

import {
  useAnalyticsSummary,
  useAnalyticsRevenue,
  useAnalyticsGrowth,
  useAnalyticsDistribution,
  useAnalyticsTopSpaces,
  useAnalyticsTopOwners,
  useAnalyticsTopCustomers,
  useAnalyticsDemographics,
  useAnalyticsCoupons,
} from '../hooks/useAdminAnalytics';
import { DashboardKPICard } from '../components/DashboardKPICard';
import { ChartCard } from '@/components/charts/ChartCard';
import { ChartSkeleton } from '@/components/charts/ChartSkeleton';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { LineChart } from '@/components/charts/LineChart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { CHART_COLORS } from '@/lib/charts/ApexConfig';

// ═══════════════════════════════════════════
//  Helper: Metric Card
// ═══════════════════════════════════════════
interface MetricCardProps {
  title: string;
  value: string;
  suffix?: string;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info';
}

const METRIC_COLORS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  info: { bg: 'bg-info/10', text: 'text-info' },
};

function MetricCard({
  title,
  value,
  suffix,
  icon: Icon,
  color,
}: MetricCardProps) {
  const c = METRIC_COLORS[color];
  return (
    <motion.div
      variants={staggerItem}
      className="relative overflow-hidden bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">{title}</div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold font-mono ${c.text}`}>
              {value}
            </span>
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}
        >
          <Icon className={`size-6 ${c.text}`} />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════
export function AdminAnalyticsPage() {
  const summary = useAnalyticsSummary();
  const revenue = useAnalyticsRevenue(6);
  const growth = useAnalyticsGrowth();
  const distribution = useAnalyticsDistribution();
  const topSpaces = useAnalyticsTopSpaces(5);
  const topOwners = useAnalyticsTopOwners(5);
  const topCustomers = useAnalyticsTopCustomers(5);
  const demographics = useAnalyticsDemographics();
  const couponsAnalytics = useAnalyticsCoupons();

  // Loading
  if (summary.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <ChartSkeleton height={320} />
        <ChartSkeleton height={320} />
      </div>
    );
  }

  // Error
  if (summary.isError || !summary.data?.data) {
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
        <Button variant="outline" onClick={() => summary.refetch()}>
          Try Again
        </Button>
      </motion.div>
    );
  }

  const stats = summary.data.data;

  const kpis = [
    {
      title: 'Total Users',
      value: Number(stats.total_users ?? 0),
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Total Spaces',
      value: Number(stats.total_spaces ?? 0),
      icon: Building2,
      color: 'info',
    },
    {
      title: 'Total Bookings',
      value: Number(stats.total_bookings ?? 0),
      icon: Calendar,
      color: 'success',
    },
    {
      title: 'Total Revenue',
      value: Number(stats.total_revenue ?? 0),
      icon: DollarSign,
      color: 'warning',
      suffix: 'EGP',
      formatted: true,
    },
  ];

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

      {/* KPI Cards */}
            {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={staggerItem}>
            <DashboardKPICard {...(kpi as any)} />
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Space Status Breakdown (لإزالة الالتباس) */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
        >
          <div className="absolute top-0 end-0 w-32 h-32 bg-success/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Approved Spaces
              </span>
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="size-4 text-success" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-success">
              {Number(stats.approved_spaces ?? 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Visible to customers
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
        >
          <div className="absolute top-0 end-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Pending Spaces
              </span>
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="size-4 text-warning" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-warning">
              {Number(stats.pending_spaces ?? 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Awaiting admin approval
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
        >
          <div className="absolute top-0 end-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Rejected Spaces
              </span>
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="size-4 text-destructive" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-destructive">
              {Number(stats.rejected_spaces ?? 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Not approved for listing
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Revenue + Distribution */}


      {/* Revenue + Distribution */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Trend"
            description="Last 6 months"
            icon={DollarSign}
            iconColor="success"
          >
            {revenue.isLoading ? (
              <ChartSkeleton height={320} />
            ) : revenue.data?.data ? (
              <AreaChart
                labels={revenue.data.data.labels}
                series={[
                  {
                    name: 'Total Revenue',
                    data: revenue.data.data.revenue.map((v) => Number(v)),
                    color: CHART_COLORS.success,
                  },
                  {
                    name: 'Owner Payout',
                    data: revenue.data.data.owner_payout.map((v) => Number(v)),
                    color: CHART_COLORS.primary,
                  },
                  {
                    name: 'Platform Commission',
                    data: revenue.data.data.platform_commission.map((v) =>
                      Number(v)
                    ),
                    color: CHART_COLORS.warning,
                  },
                ]}
                currency="EGP"
                height={320}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">
                No revenue data yet
              </p>
            )}
          </ChartCard>
        </div>

        <ChartCard
          title="Booking Status"
          description="Overall distribution"
          icon={PieChart}
          iconColor="warning"
        >
          {distribution.isLoading ? (
            <ChartSkeleton height={320} />
          ) : distribution.data?.data ? (
            <DonutChart
              labels={distribution.data.data.bookings.labels}
              series={distribution.data.data.bookings.counts.map((v) =>
                Number(v)
              )}
              height={320}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              No data yet
            </p>
          )}
        </ChartCard>
      </motion.div>

      {/* Growth + Space Types */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <ChartCard
          title="Platform Growth"
          description="Users & spaces (last 6 months)"
          icon={TrendingUp}
          iconColor="info"
        >
          {growth.isLoading ? (
            <ChartSkeleton height={300} />
          ) : growth.data?.data ? (
            <LineChart
              labels={growth.data.data.users.labels}
              series={[
                {
                  name: 'Users',
                  data: growth.data.data.users.counts.map((v) => Number(v)),
                  color: CHART_COLORS.primary,
                },
                {
                  name: 'Spaces',
                  data: growth.data.data.spaces.counts.map((v) => Number(v)),
                  color: CHART_COLORS.secondary,
                },
              ]}
              height={300}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              No growth data yet
            </p>
          )}
        </ChartCard>

        <ChartCard
          title="Space Types"
          description="Distribution by type"
          icon={Layers}
          iconColor="secondary"
        >
          {distribution.isLoading ? (
            <ChartSkeleton height={300} />
          ) : distribution.data?.data ? (
            <BarChart
              labels={distribution.data.data.space_types.labels}
              series={[
                {
                  name: 'Spaces',
                  data: distribution.data.data.space_types.counts.map((v) =>
                    Number(v)
                  ),
                },
              ]}
              height={300}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              No data yet
            </p>
          )}
        </ChartCard>
      </motion.div>

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
          <MetricCard
            title="Avg. Platform Rating"
            value={Number(stats.avg_platform_rating ?? 0).toFixed(2)}
            suffix="★"
            icon={Award}
            color="warning"
          />
          <MetricCard
            title="Completion Rate"
            value={(
              (Number(stats.completed_bookings ?? 0) /
                Math.max(Number(stats.total_bookings ?? 1), 1)) *
              100
            ).toFixed(1)}
            suffix="%"
            icon={TrendingUp}
            color="success"
          />
          <MetricCard
            title="Active Users"
            value={(
              Number(stats.total_users ?? 0) -
              Number(stats.suspended_users ?? 0)
            ).toString()}
            suffix={`/ ${Number(stats.total_users ?? 0)}`}
            icon={UserCheck}
            color="primary"
          />
        </motion.div>
      </div>

      {/* Top Lists */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Top Spaces */}
        <ChartCard
          title="Top Spaces"
          description="By revenue"
          icon={Building2}
          iconColor="primary"
        >
          {topSpaces.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(topSpaces.data?.data ?? []).slice(0, 5).map((space, i) => (
                <div
                  key={space.space_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {space.space_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Number(space.total_bookings ?? 0)} bookings
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-success shrink-0">
                    {Number(space.total_revenue ?? 0).toFixed(0)} EGP
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        {/* Top Owners */}
        <ChartCard
          title="Top Owners"
          description="By earnings"
          icon={UserCheck}
          iconColor="secondary"
        >
          {topOwners.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(topOwners.data?.data ?? []).slice(0, 5).map((owner, i) => (
                <div
                  key={owner.owner_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {owner.owner_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Number(owner.total_spaces ?? 0)} spaces
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-primary shrink-0">
                    {Number(owner.total_earnings ?? 0).toFixed(0)} EGP
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        {/* Top Customers */}
        <ChartCard
          title="Top Customers"
          description="By spending"
          icon={Users}
          iconColor="info"
        >
          {topCustomers.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(topCustomers.data?.data ?? []).slice(0, 5).map((cust, i) => (
                <div
                  key={cust.customer_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-info/10 text-info flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {cust.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Number(cust.total_bookings ?? 0)} bookings
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-warning shrink-0">
                    {Number(cust.total_spent ?? 0).toFixed(0)} EGP
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </motion.div>
          {/* ============================================ */}
      {/* DEMOGRAPHICS */}
      {/* ============================================ */}
      <div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg font-heading font-semibold mb-3 flex items-center gap-2"
        >
          <Users className="size-5 text-info" />
          User Demographics
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <MetricCard
            title="Average Age"
            value={Number(demographics.data?.data?.avg_age ?? 0).toFixed(1)}
            suffix="years"
            icon={Users}
            color="info"
          />
          <div className="lg:col-span-2">
            <ChartCard
              title="Age Distribution"
              description="Users by age group"
              icon={BarChart3}
              iconColor="primary"
            >
              {demographics.isLoading ? (
                <ChartSkeleton height={260} />
              ) : demographics.data?.data ? (
                <BarChart
                  labels={demographics.data.data.age_distribution.labels}
                  series={[
                    {
                      name: 'Users',
                      data: demographics.data.data.age_distribution.counts.map((v) => Number(v)),
                    },
                  ]}
                  height={260}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No data</p>
              )}
            </ChartCard>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          <ChartCard
            title="Average Age by Role"
            description="Customers, owners, admins"
            icon={UserCheck}
            iconColor="secondary"
          >
            {demographics.isLoading ? (
              <ChartSkeleton height={240} />
            ) : demographics.data?.data ? (
              <BarChart
                labels={demographics.data.data.by_role.map((r) => r.role)}
                series={[
                  {
                    name: 'Avg Age',
                    data: demographics.data.data.by_role.map((r) => Number(r.avg_age)),
                  },
                ]}
                height={240}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No data</p>
            )}
          </ChartCard>

          <ChartCard
            title="Gender Distribution"
            description="All users"
            icon={PieChart}
            iconColor="info"
          >
            {demographics.isLoading ? (
              <ChartSkeleton height={240} />
            ) : demographics.data?.data ? (
              <DonutChart
                labels={demographics.data.data.by_gender.labels}
                series={demographics.data.data.by_gender.counts.map((v) => Number(v))}
                height={240}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No data</p>
            )}
          </ChartCard>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* COUPONS ANALYTICS */}
      {/* ============================================ */}
      <div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg font-heading font-semibold mb-3 flex items-center gap-2"
        >
          <Ticket className="size-5 text-primary" />
          Coupons Analytics
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard
            title="Total Coupons"
            value={Number(couponsAnalytics.data?.data?.totals?.total ?? 0).toString()}
            icon={Ticket}
            color="primary"
          />
          <MetricCard
            title="Used"
            value={Number(couponsAnalytics.data?.data?.totals?.used ?? 0).toString()}
            suffix={"/ " + Number(couponsAnalytics.data?.data?.totals?.total ?? 0)}
            icon={CheckCircle2}
            color="success"
          />
          <MetricCard
            title="Usage Rate"
            value={Number(couponsAnalytics.data?.data?.totals?.usage_rate ?? 0).toFixed(1)}
            suffix="%"
            icon={TrendingUp}
            color="warning"
          />
          <MetricCard
            title="Discounts Given"
            value={Number(couponsAnalytics.data?.data?.totals?.total_discount_given ?? 0).toFixed(0)}
            suffix="EGP"
            icon={DollarSign}
            color="info"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4"
        >
          <div className="lg:col-span-2">
            <ChartCard
              title="Monthly Coupon Usage"
              description="Last 6 months"
              icon={Activity}
              iconColor="primary"
            >
              {couponsAnalytics.isLoading ? (
                <ChartSkeleton height={280} />
              ) : couponsAnalytics.data?.data ? (
                <LineChart
                  labels={couponsAnalytics.data.data.monthly_usage.labels}
                  series={[
                    {
                      name: 'Coupons Used',
                      data: couponsAnalytics.data.data.monthly_usage.counts.map((v) => Number(v)),
                      color: CHART_COLORS.primary,
                    },
                    {
                      name: 'Discounts (EGP)',
                      data: couponsAnalytics.data.data.monthly_usage.discounts.map((v) => Number(v)),
                      color: CHART_COLORS.warning,
                    },
                  ]}
                  height={280}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No usage data yet</p>
              )}
            </ChartCard>
          </div>

          <ChartCard
            title="Recently Used"
            description="Latest 5 coupons"
            icon={Award}
            iconColor="warning"
          >
            {couponsAnalytics.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(couponsAnalytics.data?.data?.top_coupons ?? []).length > 0 ? (
                  (couponsAnalytics.data?.data?.top_coupons ?? []).map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-mono font-medium truncate">{c.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(c.used_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-mono font-bold text-success shrink-0">
                        -{Number(c.discount_value).toFixed(0)} EGP
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No coupons used yet
                  </p>
                )}
              </div>
            )}
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  );
}