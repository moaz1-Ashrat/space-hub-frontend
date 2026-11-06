// src/components/charts/ChartCard.tsx
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/lib/animations';

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const ICON_COLORS = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

export function ChartCard({
  title,
  description,
  icon: Icon,
  iconColor = 'primary',
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                ICON_COLORS[iconColor]
              )}
            >
              <Icon className="size-5" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-sm truncate">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Content */}
      <div>{children}</div>
    </motion.div>
  );
}