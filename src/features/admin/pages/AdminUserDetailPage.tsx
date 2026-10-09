// src/features/admin/pages/AdminUserDetailPage.tsx
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  Star,
  User as UserIcon,
  UserCheck,
  UserX,
} from 'lucide-react';

import { useUserDetail } from '../hooks/useUserDetail';
import { useSuspendUser } from '../hooks/useSuspendUser';
import { useActivateUser } from '../hooks/useActivateUser';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/animations';

const ROLE_CONFIG = {
  customer: {
    label: 'Customer',
    className: 'bg-primary/10 text-primary border-primary/30',
    icon: UserIcon,
  },
  space_owner: {
    label: 'Space Owner',
    className: 'bg-secondary/10 text-secondary border-secondary/30',
    icon: Building2,
  },
  admin: {
    label: 'Admin',
    className: 'bg-warning/10 text-warning border-warning/30',
    icon: Star,
  },
} as const;

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { data, isLoading, isError, refetch } = useUserDetail(userId);
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <AlertCircle className="size-12 mx-auto text-destructive mb-4" />
        <p className="text-xl font-medium">User not found</p>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          The endpoint may not be available yet, or the user doesn't exist.
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = data.data;
  const roleConfig = ROLE_CONFIG[user.role];
  const RoleIcon = roleConfig.icon;
  const isPending =
    suspendMutation.isPending || activateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Users
      </Link>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-heading font-bold truncate">
                {user.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleConfig.className}`}
              >
                <RoleIcon className="size-3.5" />
                {roleConfig.label}
              </span>
              {user.is_active ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success border border-success/30 text-xs font-medium">
                  <UserCheck className="size-3.5" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30 text-xs font-medium">
                  <UserX className="size-3.5" />
                  Suspended
                </span>
              )}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-3.5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                <span>
                  Joined{' '}
                  {new Date(user.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="shrink-0">
            {user.is_active ? (
              <Button
                variant="outline"
                onClick={() => suspendMutation.mutate(user.id)}
                disabled={isPending}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Ban className="size-4 me-2" />
                Suspend
              </Button>
            ) : (
              <Button
                onClick={() => activateMutation.mutate(user.id)}
                disabled={isPending}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle2 className="size-4 me-2" />
                Activate
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats (varies by role) */}
      {user.role === 'customer' && user.customer && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              label: 'Total Bookings',
              value: user.customer.total_bookings,
              icon: Calendar,
            },
            {
              label: 'Total Spent',
              value: `${user.customer.total_spent.toFixed(2)} EGP`,
              icon: CreditCard,
            },
            {
              label: 'Reviews Written',
              value: user.customer.total_reviews,
              icon: Star,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <stat.icon className="size-3.5" />
                {stat.label}
              </div>
              <div className="text-2xl font-heading font-bold text-primary">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {user.role === 'space_owner' && user.space_owner && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              label: 'Total Spaces',
              value: user.space_owner.total_spaces,
              icon: Building2,
            },
            {
              label: 'Approved Spaces',
              value: user.space_owner.approved_spaces,
              icon: CheckCircle2,
            },
            {
              label: 'Total Earnings',
              value: `${user.space_owner.total_earnings.toFixed(2)} EGP`,
              icon: CreditCard,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <stat.icon className="size-3.5" />
                {stat.label}
              </div>
              <div className="text-2xl font-heading font-bold text-primary">
                {stat.value}
              </div>
            </motion.div>
          ))}

          {/* Tax info */}
          <motion.div
            variants={staggerItem}
            className="md:col-span-3 p-4 rounded-xl bg-muted/30 border border-border text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Tax Registration Number
              </span>
              <span className="font-mono font-medium">
                {user.space_owner.tax_registration_number}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {user.role === 'admin' && user.admin && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Level of Authority
            </span>
            <span className="font-medium capitalize">
              {user.admin.level_of_authority}
            </span>
          </div>
        </motion.div>
      )}

      {/* Warning for suspended */}
      {!user.is_active && (
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">
                This account is suspended
              </p>
              <p className="text-muted-foreground mt-0.5">
                The user cannot log in or use the platform. All their tokens
                have been revoked. Click "Activate" to restore access.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}