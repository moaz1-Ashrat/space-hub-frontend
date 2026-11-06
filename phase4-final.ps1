$ErrorActionPreference = 'Stop'

Write-Host "`n=== PHASE 4 final files ===`n" -ForegroundColor Cyan

# 1) Sidebar.tsx (نسخة محدثة)
@'
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
  Ticket,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

interface NavLinkConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
      { label: 'My Coupons', href: '/customer/coupons', icon: Ticket },
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
      { label: 'Overview', href: '/owner', icon: LayoutDashboard, matcher: (p) => p === '/owner' },
      {
        label: 'My Spaces',
        href: '/owner/spaces',
        icon: Building2,
        matcher: (p) =>
          p === '/owner/spaces' ||
          p === '/owner/spaces/create' ||
          /^\/owner\/spaces\/\d+\/edit$/.test(p),
      },
      {
        label: 'Availability',
        href: '/owner/availability',
        icon: Clock,
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
      { label: 'All Spaces', href: '/admin/spaces', icon: Building2 },
      { label: 'Pending Spaces', href: '/admin/spaces/pending', icon: Clock },
      { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
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
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
'@ | Set-Content -Path src\components\shared\Sidebar.tsx -Encoding UTF8
Write-Host "OVERWRITTEN : Sidebar.tsx" -ForegroundColor Green

# 2) routes/index.tsx
@'
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../../components/layouts/PublicLayout';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Auth
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterCustomerPage } from '../../features/auth/pages/RegisterCustomerPage';
import { RegisterOwnerPage } from '../../features/auth/pages/RegisterOwnerPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { ProfileEditPage } from '../../features/auth/pages/ProfileEditPage';
import { ChangePasswordPage } from '../../features/auth/pages/ChangePasswordPage';

// Public
import { HomePage } from '../../features/home/pages/HomePage';
import { SpacesListPage } from '../../features/spaces/pages/SpacesListPage';
import { SpaceDetailPage } from '../../features/spaces/pages/SpaceDetailPage';
import { AboutPage } from '../../features/pages/AboutPage';
import { ContactPage } from '../../features/pages/ContactPage';
import { NotFoundPage } from '../../features/pages/NotFoundPage';

// Customer
import { CustomerOverviewPage } from '../../features/customer/pages/CustomerOverviewPage';
import { MyBookingsPage } from '../../features/bookings/pages/MyBookingsPage';
import { BookingDetailPage } from '../../features/bookings/pages/BookingDetailPage';
import { CheckoutPage } from '../../features/bookings/pages/CheckoutPage';
import { PaymentsPage } from '../../features/payments/pages/PaymentsPage';
import { MyReviewsPage } from '../../features/reviews/pages/MyReviewsPage';
import { ProfilePage } from '../../features/customer/pages/ProfilePage';
import { MyCouponsPage } from '../../features/coupons/pages/MyCouponsPage';

// Owner
import { OwnerOverviewPage } from '../../features/owner/pages/OwnerOverviewPage';
import { MySpacesPage } from '../../features/owner/pages/MySpacesPage';
import { CreateSpacePage } from '../../features/owner/pages/CreateSpacePage';
import { EditSpacePage } from '../../features/owner/pages/EditSpacePage';
import { SpaceAvailabilityPage } from '../../features/owner/pages/SpaceAvailabilityPage';
import { AvailabilityOverviewPage } from '../../features/owner/pages/AvailabilityOverviewPage';
import { OwnerBookingsPage } from '../../features/owner/pages/OwnerBookingsPage';
import { EarningsPage } from '../../features/owner/pages/EarningsPage';

// Admin
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from '../../features/admin/pages/AdminUsersPage';
import { AdminPendingSpacesPage } from '../../features/admin/pages/AdminPendingSpacesPage';
import { AdminTransactionsPage } from '../../features/admin/pages/AdminTransactionsPage';
import { AdminAnalyticsPage } from '../../features/admin/pages/AdminAnalyticsPage';
import { AdminSettingsPage } from '../../features/admin/pages/AdminSettingsPage';
import { AdminAllSpacesPage } from '../../features/admin/pages/AdminAllSpacesPage';
import { AdminUserDetailPage } from '../../features/admin/pages/AdminUserDetailPage';
import { AdminCouponsPage } from '../../features/admin/pages/AdminCouponsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'spaces', element: <SpacesListPage /> },
      { path: 'spaces/:id', element: <SpaceDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterCustomerPage /> },
      { path: '/register/owner', element: <RegisterOwnerPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RoleRoute allowedRoles={['customer']} />,
            children: [
              { path: '/customer', element: <CustomerOverviewPage /> },
              { path: '/customer/bookings', element: <MyBookingsPage /> },
              { path: '/customer/bookings/:id', element: <BookingDetailPage /> },
              { path: '/customer/bookings/:id/checkout', element: <CheckoutPage /> },
              { path: '/customer/payments', element: <PaymentsPage /> },
              { path: '/customer/reviews', element: <MyReviewsPage /> },
              { path: '/customer/coupons', element: <MyCouponsPage /> },
              { path: '/customer/profile', element: <ProfilePage /> },
              { path: '/customer/profile/edit', element: <ProfileEditPage /> },
              { path: '/customer/profile/password', element: <ChangePasswordPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RoleRoute allowedRoles={['space_owner']} />,
            children: [
              { path: '/owner', element: <OwnerOverviewPage /> },
              { path: '/owner/spaces', element: <MySpacesPage /> },
              { path: '/owner/spaces/create', element: <CreateSpacePage /> },
              { path: '/owner/spaces/:id/edit', element: <EditSpacePage /> },
              { path: '/owner/spaces/:id/availability', element: <SpaceAvailabilityPage /> },
              { path: '/owner/availability', element: <AvailabilityOverviewPage /> },
              { path: '/owner/bookings', element: <OwnerBookingsPage /> },
              { path: '/owner/earnings', element: <EarningsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RoleRoute allowedRoles={['admin']} />,
            children: [
              { path: '/admin', element: <AdminDashboardPage /> },
              { path: '/admin/users', element: <AdminUsersPage /> },
              { path: '/admin/users/:id', element: <AdminUserDetailPage /> },
              { path: '/admin/spaces', element: <AdminAllSpacesPage /> },
              { path: '/admin/spaces/pending', element: <AdminPendingSpacesPage /> },
              { path: '/admin/transactions', element: <AdminTransactionsPage /> },
              { path: '/admin/coupons', element: <AdminCouponsPage /> },
              { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
              { path: '/admin/settings', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
'@ | Set-Content -Path src\app\routes\index.tsx -Encoding UTF8
Write-Host "OVERWRITTEN : routes/index.tsx" -ForegroundColor Green

Write-Host "`n=== Done ===`n" -ForegroundColor Cyan