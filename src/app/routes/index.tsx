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

export const router = createBrowserRouter([
  // Public
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

  // Auth
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

  // Customer
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
              { path: '/customer/profile', element: <ProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  // Owner
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
              {
                path: '/owner/spaces/:id/availability',
                element: <SpaceAvailabilityPage />,
              },
              { path: '/owner/availability', element: <AvailabilityOverviewPage /> },
              { path: '/owner/bookings', element: <OwnerBookingsPage /> },
              { path: '/owner/earnings', element: <EarningsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Admin
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
              { path: '/admin/spaces/pending', element: <AdminPendingSpacesPage /> },
              { path: '/admin/transactions', element: <AdminTransactionsPage /> },
              { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
              { path: '/admin/settings', element: <AdminSettingsPage /> },
               { path: '/admin/users', element: <AdminUsersPage /> },
{ path: '/admin/users/:id', element: <AdminUserDetailPage /> },
{ path: '/admin/spaces', element: <AdminAllSpacesPage /> },
{ path: '/admin/spaces/pending', element: <AdminPendingSpacesPage /> },

            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);