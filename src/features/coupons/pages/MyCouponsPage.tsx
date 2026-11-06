import { motion } from 'framer-motion';
import { AlertCircle, Ticket, CheckCircle2, Calendar } from 'lucide-react';

import { useMyCoupons } from '../hooks/useMyCoupons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function MyCouponsPage() {
  const { data, isLoading, isError, refetch } = useMyCoupons();
  const coupons = data?.data ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <Ticket className="size-7 text-primary" />
          My Coupons
        </h1>
        <p className="text-muted-foreground mt-1">
          Available coupons for your account
        </p>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl"
        >
          <AlertCircle className="size-10 mx-auto text-destructive mb-3" />
          <p className="text-lg font-medium text-destructive">
            Failed to load coupons
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {data && coupons.length === 0 && (
        <EmptyState
          icon={Ticket}
          title="No coupons available"
          description="You don't have any available coupons right now. Check back later!"
        />
      )}

      {data && coupons.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              variants={staggerItem}
              className="relative overflow-hidden rounded-xl border border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5 p-5"
            >
              <div className="absolute -start-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
              <div className="absolute -end-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Coupon Code
                  </div>
                  <div className="font-mono font-bold text-lg text-primary">
                    {coupon.code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">
                    {coupon.discount_value.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">EGP off</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                {coupon.expiry_date ? (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="size-3" />
                    Expires: {coupon.expiry_date}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No expiry</span>
                )}
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="size-3" />
                  Available
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}