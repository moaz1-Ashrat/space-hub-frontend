// src/features/admin/pages/AdminSettingsPage.tsx
import { motion } from 'framer-motion';
import {
  Settings,
  Construction,
  Percent,
  CreditCard,
  Mail,
  Bell,
  DollarSign,
  Wrench,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

const UPCOMING_FEATURES = [
  {
    icon: Percent,
    title: 'Commission Rates',
    description: 'Set platform commission per space type',
  },
  {
    icon: CreditCard,
    title: 'Payment Gateways',
    description: 'Configure Stripe, Paymob, and other providers',
  },
  {
    icon: Mail,
    title: 'Email Templates',
    description: 'Customize booking confirmation and notification emails',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Push and email notification preferences',
  },
  {
    icon: DollarSign,
    title: 'Platform Fees',
    description: 'Service fees and pricing rules',
  },
  {
    icon: Wrench,
    title: 'Maintenance Mode',
    description: 'Temporarily disable public access',
  },
];

export function AdminSettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Settings className="size-7 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform configuration and preferences
          </p>
        </div>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-primary/20 p-8"
      >
        {/* Decorative */}
        <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative text-center max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-warning/20 to-primary/20 flex items-center justify-center mb-4 border border-warning/30"
          >
            <Construction className="size-10 text-warning" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-medium mb-3"
          >
            <Sparkles className="size-3" />
            Coming Soon
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-heading font-bold mb-2"
          >
            Platform Settings in Development
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground leading-relaxed"
          >
            We're building a comprehensive settings panel that will let you
            configure commission rates, payment gateways, email templates, and
            more — all from one place.
          </motion.p>
        </div>
      </motion.div>

      {/* Upcoming Features Grid */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-sm font-heading font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Upcoming Features
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {UPCOMING_FEATURES.map((feature, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="group relative p-4 bg-card border border-border rounded-xl flex items-start gap-3 hover:border-primary/40 hover:shadow-md transition-all cursor-not-allowed opacity-70 hover:opacity-100"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <feature.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium uppercase tracking-wider">
                  Soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
          </motion.div>
        ))}
      </motion.div>

      {/* Info footer */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="p-4 rounded-xl bg-info/5 border border-info/20 text-xs text-center"
      >
        <p className="text-muted-foreground">
          Have a specific setting in mind? These features are prioritized based
          on platform needs and will roll out progressively.
        </p>
      </motion.div>
    </motion.div>
  );
}