import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

interface NavLinkConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  onLinkClick?: () => void;
}

const customerLinks: NavLinkConfig[] = [
  { label: 'Overview', href: '/customer', icon: LayoutDashboard },
  { label: 'My Bookings', href: '/customer/bookings', icon: Calendar },
  { label: 'Payments', href: '/customer/payments', icon: CreditCard },
  { label: 'Profile', href: '/customer/profile', icon: User },
];

const ownerLinks: NavLinkConfig[] = [
  { label: 'Overview', href: '/owner', icon: LayoutDashboard },
  { label: 'My Spaces', href: '/owner/spaces', icon: Building2 },
  { label: 'Bookings', href: '/owner/bookings', icon: Calendar },
  { label: 'Earnings', href: '/owner/earnings', icon: DollarSign },
];

const adminLinks: NavLinkConfig[] = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Pending Spaces', href: '/admin/spaces/pending', icon: Clock },
  { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { label: 'Analytics', href: '/admin/analytics', icon: LayoutDashboard },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const linksByRole: Record<UserRole, NavLinkConfig[]> = {
  customer: customerLinks,
  space_owner: ownerLinks,
  admin: adminLinks,
};

export function Sidebar({ onLinkClick }: SidebarProps = {}) {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const links = linksByRole[user.role];
  const exactPaths = ['/customer', '/owner', '/admin'];

  return (
    <aside className="w-64 h-full border-e border-border bg-surface p-4 overflow-y-auto">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={exactPaths.includes(link.href)}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <link.icon className="size-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}