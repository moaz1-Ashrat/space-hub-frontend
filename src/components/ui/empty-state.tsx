// src/components/ui/empty-state.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {/* Animated icon */}
      <motion.div variants={staggerItem} className="relative mb-6">
        {/* Pulse ring */}
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30"
        />
        {/* Icon container */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="size-9 text-primary" strokeWidth={1.75} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={staggerItem}
        className="font-heading text-xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={staggerItem}
        className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Actions */}
      {(actionLabel || secondaryLabel) && (
        <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            actionHref ? (
              <Button asChild>
                <Link to={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onAction}>{actionLabel}</Button>
            )
          )}
          {secondaryLabel && secondaryHref && (
            <Button asChild variant="outline">
              <Link to={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}