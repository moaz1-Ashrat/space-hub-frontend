import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { DashboardKPICard } from '../components/DashboardKPICard';

export function AdminAnalyticsPage() {
  const { data: dashData, isLoading: dashLoading } = useDashboard();
  const { data: transData, isLoading: transLoading } = useTransactions({
    status: 'paid',
    page: 1,
  });

  if (dashLoading || transLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = dashData?.data;
  const payments = transData?.data ?? [];

  if (!stats) return null;

  const avgBookingValue =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.amount), 0) / payments.length
      : 0;

  const completionRate =
    stats.total_bookings > 0
      ? ((stats.total_bookings - stats.pending_spaces) / stats.total_bookings) *
        100
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform growth and performance insights
        </p>
      </div>

      {/* Platform Growth */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">
          Platform Growth
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardKPICard
            title="Total Users"
            value={stats.total_users}
            icon={Users}
            color="primary"
          />
          <DashboardKPICard
            title="Total Spaces"
            value={stats.total_spaces}
            icon={Building2}
            color="info"
          />
          <DashboardKPICard
            title="Total Bookings"
            value={stats.total_bookings}
            icon={Calendar}
            color="success"
          />
          <DashboardKPICard
            title="Revenue"
            value={stats.total_revenue}
            icon={DollarSign}
            color="warning"
            suffix="EGP"
            formatted
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">
          Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-success" />
              <span className="text-sm text-muted-foreground">
                Avg. Booking Value
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-primary">
              {avgBookingValue.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              EGP per paid booking
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-info" />
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

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-warning" />
              <span className="text-sm text-muted-foreground">
                Pending Approvals
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-warning">
              {stats.pending_spaces}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Spaces awaiting review
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">
          Recent Payments
        </h2>
        {payments.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No payment data available</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {payments.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-sm font-medium">
                    {p.customer_name ?? 'Unknown customer'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.payment_methode ?? 'method unknown'} •{' '}
                    {p.payment_date_time
                      ? new Date(p.payment_date_time).toLocaleDateString('en-GB')
                      : 'no date'}
                  </div>
                </div>
                <div className="font-mono font-bold text-primary">
                  {Number(p.amount).toFixed(2)} EGP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}