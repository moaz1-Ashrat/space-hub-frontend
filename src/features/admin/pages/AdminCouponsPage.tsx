import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, Edit2, Plus, Search, Ticket, Trash2, CheckCircle2, XCircle,
} from 'lucide-react';

import { useAdminCoupons } from '../hooks/useAdminCoupons';
import { useCreateCoupon } from '../hooks/useCreateCoupon';
import { useUpdateCoupon } from '../hooks/useUpdateCoupon';
import { useDeleteCoupon } from '../hooks/useDeleteCoupon';
import { CouponFormDialog } from '../components/CouponFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { AdminCoupon, CouponFilters, CreateCouponPayload } from '../types';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

export function AdminCouponsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);

  const filters: CouponFilters = { page, ...(search ? { code: search } : {}) };

  const { data, isLoading, isError, refetch } = useAdminCoupons(filters);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (c: AdminCoupon) => {
    setEditing(c);
    setDialogOpen(true);
  };

  const handleDelete = (c: AdminCoupon) => {
    const msg = 'Delete coupon "' + c.code + '"? This cannot be undone.';
    if (window.confirm(msg)) {
      deleteMutation.mutate(c.id);
    }
  };

  const handleSubmit = async (payload: CreateCouponPayload) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const coupons = data?.data ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Ticket className="size-7 text-primary" />
            Coupons
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage discount coupons available on the platform
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="size-4 me-2" />
          Add Coupon
        </Button>
      </motion.div>

      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        onSubmit={handleSearch}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="ps-9 font-mono"
          />
        </div>
        <Button type="submit">Search</Button>
      </motion.form>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl">
          <AlertCircle className="size-10 mx-auto text-destructive mb-3" />
          <p className="text-lg font-medium text-destructive">Failed to load coupons</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {data && coupons.length === 0 && (
        <EmptyState
          icon={Ticket}
          title={search ? 'No coupons match your search' : 'No coupons yet'}
          description={
            search
              ? 'Try a different code.'
              : 'Create your first coupon to offer discounts to your customers.'
          }
          actionLabel={search ? 'Clear Search' : 'Create Coupon'}
          onAction={
            search
              ? () => {
                  setSearch('');
                  setSearchInput('');
                  setPage(1);
                }
              : handleAdd
          }
        />
      )}

      {data && coupons.length > 0 && (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {coupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                variants={staggerItem}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase text-primary font-medium">Code</span>
                  <span className="text-xs font-mono font-bold">{coupon.code}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-success text-lg">
                      {coupon.discount_value.toFixed(2)} EGP
                    </span>
                    {coupon.commission_rate !== null && (
                      <span className="text-xs text-muted-foreground">
                        Commission: {(coupon.commission_rate * 100).toFixed(0)}%
                      </span>
                    )}
                    {coupon.user_id === null ? (
                      <span className="px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/30 text-[10px] font-medium">
                        Generic
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-[10px] font-medium">
                        User #{coupon.user_id}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {coupon.expiry_date && <span>Expires: {coupon.expiry_date}</span>}
                    {coupon.used_at && (
                      <span>Used: {new Date(coupon.used_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div
                  className={
                    'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ' +
                    (coupon.is_used
                      ? 'bg-muted text-muted-foreground border-border'
                      : 'bg-success/10 text-success border-success/30')
                  }
                >
                  {coupon.is_used ? (
                    <>
                      <XCircle className="size-3" />
                      Used
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-3" />
                      Available
                    </>
                  )}
                </div>

                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(coupon)}
                    title="Edit"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(coupon)}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="outline"
                disabled={!data.links.prev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                disabled={!data.links.next}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        coupon={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </motion.div>
  );
}
