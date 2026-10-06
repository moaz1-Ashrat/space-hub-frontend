import { User, Mail, Calendar, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '../types';

interface AdminUserCardProps {
  user: AdminUser;
  onSuspend: (id: number) => void;
  onActivate: (id: number) => void;
  isSuspending?: boolean;
  isActivating?: boolean;
}

const roleConfig = {
  customer: {
    label: 'Customer',
    className: 'bg-info/10 text-info border-info/30',
  },
  space_owner: {
    label: 'Owner',
    className: 'bg-primary/10 text-primary border-primary/30',
  },
  admin: {
    label: 'Admin',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
};

export function AdminUserCard({
  user,
  onSuspend,
  onActivate,
  isSuspending,
  isActivating,
}: AdminUserCardProps) {
  const role = roleConfig[user.role];

  const handleSuspend = () => {
    if (
      confirm(
        `Suspend "${user.name}"? They will be logged out and unable to sign in until reactivated.`
      )
    ) {
      onSuspend(user.id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-heading font-bold text-primary text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-semibold truncate">
                {user.name}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${role.className}`}
              >
                {role.label}
              </span>
              {!user.is_active && (
                <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-error/10 text-error border-error/30">
                  Suspended
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(user.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <User className="size-3" />
                #{user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 shrink-0">
          {user.is_active ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSuspend}
              disabled={isSuspending}
              className="text-error border-error/30 hover:bg-error/10"
            >
              <Ban className="size-3.5" />
              {isSuspending ? 'Suspending...' : 'Suspend'}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onActivate(user.id)}
              disabled={isActivating}
            >
              <CheckCircle className="size-3.5" />
              {isActivating ? 'Activating...' : 'Activate'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}