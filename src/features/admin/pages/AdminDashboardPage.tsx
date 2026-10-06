import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardKPICard } from '../components/DashboardKPICard';

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center bg-error/5 border border-error/20 rounded-xl">
        <p className="text-error">Failed to load dashboard</p>
      </div>
    );
  }

  const stats = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and key metrics
        </p>
      </div>

      {/* Main KPIs */}
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
          title="Total Revenue"
          value={stats.total_revenue}
          icon={DollarSign}
          color="warning"
          suffix="EGP"
          formatted
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPICard
          title="Customers"
          value={stats.total_customers}
          icon={UserCheck}
          color="info"
        />
        <DashboardKPICard
          title="Owners"
          value={stats.total_owners}
          icon={UserCog}
          color="primary"
        />
        <DashboardKPICard
          title="Pending Approvals"
          value={stats.pending_spaces}
          icon={Clock}
          color="warning"
        />
        <DashboardKPICard
          title="Active Bookings"
          value={stats.total_bookings - stats.pending_spaces}
          icon={Calendar}
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/spaces/pending"
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white hover:opacity-95 transition-opacity"
        >
          <Clock className="size-8 mb-2" />
          <h3 className="text-xl font-heading font-semibold mb-1">
            Review Pending Spaces
          </h3>
          <p className="text-white/80 text-sm mb-3">
            {stats.pending_spaces} space{stats.pending_spaces !== 1 ? 's' : ''} awaiting approval
          </p>
          <ArrowRight className="size-5" />
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
        >
          <BarChart3 className="size-8 text-primary mb-2" />
          <h3 className="text-xl font-heading font-semibold mb-1">
            View Analytics
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            Revenue and user growth insights
          </p>
          <ArrowRight className="size-5 text-primary" />
        </Link>
      </div>
    </div>
  );
}