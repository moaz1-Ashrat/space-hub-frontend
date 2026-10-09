// src/components/shared/Sidebar.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Sparkles,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

interface NavLinkConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Custom matcher — لو موجود، يُستخدم بدل NavLink الافتراضي.
   * يستقبل الـ current pathname ويرجع boolean.
   */
  matcher?: (pathname: string) => boolean;
}

interface SectionConfig {
  title?: string;
  links: NavLinkConfig[];
}

const customerSections: SectionConfig[] = [
  {
    links: [
      { label: 'Overview', href: '/customer', icon: LayoutDashboard },
      { label: 'My Bookings', href: '/customer/bookings', icon: Calendar },
      { label: 'Payments', href: '/customer/payments', icon: CreditCard },
      { label: 'My Reviews', href: '/customer/reviews', icon: Star },
    ],
  },
  {
    title: 'Account',
    links: [{ label: 'Profile', href: '/customer/profile', icon: User }],
  },
];

const ownerSections: SectionConfig[] = [
  {
    title: 'Management',
    links: [
      {
        label: 'Overview',
        href: '/owner',
        icon: LayoutDashboard,
        matcher: (p) => p === '/owner',
      },
      {
        label: 'My Spaces',
        href: '/owner/spaces',
        icon: Building2,
        // ✅ لا يتطابق مع availability sub-routes
        matcher: (p) =>
          p === '/owner/spaces' ||
          p === '/owner/spaces/create' ||
          /^\/owner\/spaces\/\d+\/edit$/.test(p),
      },
      {
        label: 'Availability',
        href: '/owner/availability',
        icon: Clock,
        // ✅ يتطابق مع الـ overview + per-space availability
        matcher: (p) =>
          p === '/owner/availability' ||
          /^\/owner\/spaces\/\d+\/availability$/.test(p),
      },
      { label: 'Bookings', href: '/owner/bookings', icon: Calendar },
      { label: 'Earnings', href: '/owner/earnings', icon: DollarSign },
    ],
  },
];

const adminSections: SectionConfig[] = [
  {
    links: [
      { label: 'Dashboard', href: '/admin', icon: BarChart3 },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'All Spaces', href: '/admin/spaces', icon: Building2 }, // ← جديد
      { label: 'Pending Spaces', href: '/admin/spaces/pending', icon: Clock },
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Analytics', href: '/admin/analytics', icon: Sparkles },
    ],
  },
  {
    title: 'System',
    links: [{ label: 'Settings', href: '/admin/settings', icon: Settings }],
  },
];

const sectionsByRole: Record<UserRole, SectionConfig[]> = {
  customer: customerSections,
  space_owner: ownerSections,
  admin: adminSections,
};

interface SidebarProps {
  onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps = {}) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) return null;

  const sections = sectionsByRole[user.role];

  const isLinkActive = (link: NavLinkConfig) => {
    if (link.matcher) return link.matcher(location.pathname);
    return (
      location.pathname === link.href ||
      location.pathname.startsWith(link.href + '/')
    );
  };

  return (
    <aside className="w-64 h-full border-e border-border bg-surface p-4 overflow-y-auto">
      <nav className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.links.map((link) => {
                const isActive = isLinkActive(link);
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={onLinkClick}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={`sidebar-active-${user.role}`}
                        className="absolute inset-y-1 start-0 w-0.5 bg-primary rounded-e-full"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <link.icon className="size-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}