import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashboardByRole: Record<UserRole, string> = {
      customer: '/customer',
      space_owner: '/owner',
      admin: '/admin',
    };
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  return <Outlet />;
}