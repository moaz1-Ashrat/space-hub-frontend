import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your account information</p>
      </div>

      {/* Avatar + Basic Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-heading font-bold text-primary">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-heading font-semibold">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Full Name</div>
              <div className="font-medium">{user.name}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Mail className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Phone className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="font-mono font-medium">{user.phone}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Shield className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Account Type</div>
              <div className="font-medium capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      {profile?.customer && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading font-semibold">Customer Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.customer.favorite && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Favorite Space Type</div>
                  <div className="font-medium">{profile.customer.favorite}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Member Since</div>
                <div className="font-medium">
                  {new Date(profile.customer.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note about editing */}
      <div className="p-4 bg-info/5 border border-info/20 rounded-xl text-sm">
        <p className="text-info">
          📌 Profile editing will be available in a future update.
        </p>
      </div>
    </div>
  );
}