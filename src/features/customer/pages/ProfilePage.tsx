// src/features/customer/pages/ProfilePage.tsx
import { motion } from 'framer-motion';
import {
  Calendar,
  Mail,
  Phone,
  Shield,
  Star,
  User as UserIcon,
  Sparkles,
  Info,
} from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  if (!user) return null;

  const ROLE_CONFIG = {
    customer: { label: 'Customer', color: 'primary' },
    space_owner: { label: 'Space Owner', color: 'secondary' },
    admin: { label: 'Admin', color: 'warning' },
  } as const;

  const roleInfo = ROLE_CONFIG[user.role];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <UserIcon className="size-7 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Your account information
        </p>
      </motion.div>

      {/* Avatar + Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-xl p-6"
      >
        <div className="absolute top-0 end-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0"
          >
            <span className="text-4xl font-heading font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-heading font-bold truncate">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${roleInfo.color}/10 text-${roleInfo.color} border border-${roleInfo.color}/30 text-xs font-medium`}
              >
                <Shield className="size-3.5" />
                {roleInfo.label}
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6 space-y-4"
      >
        <motion.h3
          variants={staggerItem}
          className="font-heading font-semibold flex items-center gap-2"
        >
          <UserIcon className="size-4 text-primary" />
          Contact Information
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: UserIcon,
              label: 'Full Name',
              value: user.name,
            },
            {
              icon: Mail,
              label: 'Email',
              value: user.email,
            },
            {
              icon: Phone,
              label: 'Phone',
              value: user.phone,
              mono: true,
            },
            {
              icon: Shield,
              label: 'Account Type',
              value: roleInfo.label,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
                <item.icon className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
                <div
                  className={`font-medium truncate ${
                    item.mono ? 'font-mono' : ''
                  }`}
                >
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Customer-specific Info */}
      {profile?.customer && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <motion.h3
            variants={staggerItem}
            className="font-heading font-semibold flex items-center gap-2"
          >
            <Sparkles className="size-4 text-primary" />
            Customer Details
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.customer.favorite && (
              <motion.div
                variants={staggerItem}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
                  <Star className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Favorite Space Type
                  </div>
                  <div className="font-medium">
                    {profile.customer.favorite}
                  </div>
                </div>
              </motion.div>
            )}

            {profile.customer.created_at && (
              <motion.div
                variants={staggerItem}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Member Since
                  </div>
                  <div className="font-medium">
                    {new Date(profile.customer.created_at).toLocaleDateString(
                      'en-GB',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Info note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-info/5 border border-info/20 text-sm flex items-start gap-2.5"
      >
        <Info className="size-4 text-info mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-info">Profile Editing Coming Soon</p>
          <p className="text-muted-foreground mt-0.5">
            You'll be able to edit your profile information, change your
            password, and manage preferences in a future update.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}