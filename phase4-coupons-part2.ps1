$ErrorActionPreference = 'Stop'

function Write-FileIfMissing {
    param([string]$Path, [string]$Content)
    $full = Join-Path $PWD $Path
    $dir  = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    if (Test-Path $full) {
        Write-Host "SKIP    : $Path" -ForegroundColor Yellow
    } else {
        Set-Content -Path $full -Value $Content -Encoding UTF8
        Write-Host "CREATED : $Path" -ForegroundColor Green
    }
}

function Patch-File {
    param([string]$Path, [string]$Marker, [string]$Search, [string]$Replace)
    $full = Join-Path $PWD $Path
    if (-not (Test-Path $full)) { Write-Host "MISSING : $Path" -ForegroundColor Red; return }
    $c = Get-Content -Path $full -Raw -Encoding UTF8
    if ($c.Contains($Marker)) { Write-Host "SKIP    : $Path (already patched)" -ForegroundColor Yellow; return }
    if (-not $c.Contains($Search)) { Write-Host "WARN    : $Path (pattern not found - do manually)" -ForegroundColor Magenta; return }
    $c = $c.Replace($Search, $Replace)
    Set-Content -Path $full -Value $c -Encoding UTF8 -NoNewline
    Write-Host "PATCHED : $Path" -ForegroundColor Green
}

function Append-FileIfMissing {
    param([string]$Path, [string]$Marker, [string]$Append)
    $full = Join-Path $PWD $Path
    if (-not (Test-Path $full)) { Write-Host "MISSING : $Path" -ForegroundColor Red; return }
    $c = Get-Content -Path $full -Raw -Encoding UTF8
    if ($c.Contains($Marker)) { Write-Host "SKIP    : $Path (already patched)" -ForegroundColor Yellow; return }
    Add-Content -Path $full -Value $Append -Encoding UTF8
    Write-Host "PATCHED : $Path (appended)" -ForegroundColor Green
}

Write-Host "`n=== PHASE 4 part 2: Big files + Patches ===`n" -ForegroundColor Cyan

# ============================================================
# CouponInput.tsx
# ============================================================
Write-FileIfMissing 'src/features/coupons/components/CouponInput.tsx' @"
import { useState } from 'react';
import { CheckCircle2, Ticket, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMyCoupons } from '../hooks/useMyCoupons';
import type { Coupon } from '../types';

interface CouponInputProps {
  value: string;
  onChange: (code: string) => void;
  onApply: (coupon: Coupon | null) => void;
}

export function CouponInput({ value, onChange, onApply }: CouponInputProps) {
  const [applied, setApplied] = useState<Coupon | null>(null);
  const { data } = useMyCoupons();
  const myCoupons = data?.data ?? [];

  const handleApply = () => {
    const code = value.trim().toUpperCase();
    if (!code) return;
    const found = myCoupons.find((c) => c.code === code);
    if (found) { setApplied(found); onApply(found); }
    else { setApplied(null); onApply(null); }
  };

  const handleClear = () => { setApplied(null); onChange(''); onApply(null); };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-1.5">
        <Ticket className="size-3.5 text-primary" />
        Coupon Code (optional)
      </label>

      {applied ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
          <CheckCircle2 className="size-4 text-success shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-success">
              Coupon applied: <span className="font-mono">{applied.code}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Discount: {applied.discount_value.toFixed(2)} EGP
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={handleClear} className="shrink-0">
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              placeholder="SAVE20"
              className="font-mono uppercase"
            />
            <Button type="button" variant="outline" onClick={handleApply}>Apply</Button>
          </div>
          {myCoupons.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground">Available:</span>
              {myCoupons.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { onChange(c.code); setApplied(c); onApply(c); }}
                  className="text-xs px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary font-mono transition-colors"
                >
                  {c.code}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
"@

# ============================================================
# CouponFormDialog.tsx
# ============================================================
Write-FileIfMissing 'src/features/admin/components/CouponFormDialog.tsx' @"
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Ticket } from 'lucide-react';

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdminCoupon, CreateCouponPayload } from '../types';

const schema = z.object({
  code: z.string().min(3, 'Code is too short').max(32, 'Code is too long'),
  user_id: z.union([z.string(), z.number()]).optional()
    .transform((v) => (v === '' || v === undefined || v === null ? null : Number(v))),
  discount_value: z.coerce.number().min(0, 'Must be >= 0'),
  commission_rate: z.union([z.string(), z.number()]).optional()
    .transform((v) => (v === '' || v === undefined || v === null ? null : Number(v))),
  expiry_date: z.string().optional().nullable(),
  is_used: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: AdminCoupon | null;
  onSubmit: (payload: CreateCouponPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function CouponFormDialog({
  open, onOpenChange, coupon, onSubmit, isSubmitting,
}: CouponFormDialogProps) {
  const isEdit = !!coupon;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '', user_id: null, discount_value: 10,
      commission_rate: null, expiry_date: '', is_used: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (coupon) {
        form.reset({
          code: coupon.code, user_id: coupon.user_id,
          discount_value: coupon.discount_value, commission_rate: coupon.commission_rate,
          expiry_date: coupon.expiry_date ?? '', is_used: coupon.is_used,
        });
      } else {
        form.reset({
          code: '', user_id: null, discount_value: 10,
          commission_rate: null, expiry_date: '', is_used: false,
        });
      }
    }
  }, [open, coupon, form]);

  const handleSubmit = async (data: FormData) => {
    await onSubmit({
      code: data.code.toUpperCase(),
      user_id: data.user_id,
      discount_value: data.discount_value,
      commission_rate: data.commission_rate,
      expiry_date: data.expiry_date || null,
      is_used: data.is_used,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="size-5 text-primary" />
            {isEdit ? 'Edit Coupon' : 'Create Coupon'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update coupon details' : 'Leave user empty for a generic coupon available to all customers'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="SAVE20" {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    className="font-mono" />
                </FormControl>
                <FormDescription>Uppercase letters/numbers (e.g., SAVE20)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="user_id" render={({ field }) => (
              <FormItem>
                <FormLabel>User ID (optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Leave empty for generic coupon"
                    {...field} value={field.value ?? ''} />
                </FormControl>
                <FormDescription>Restricted to a specific user. Empty = available for all.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="discount_value" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (EGP)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="commission_rate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.10"
                      {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>0.10 = 10%</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="expiry_date" render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="is_used" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mark as used</FormLabel>
                  <p className="text-xs text-muted-foreground">Used coupons cannot be applied to bookings</p>
                </div>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 me-2 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
"@

# ============================================================
# AdminCouponsPage.tsx
# ============================================================
Write-FileIfMissing 'src/features/admin/pages/AdminCouponsPage.tsx' @"
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

  const handleAdd = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (c: AdminCoupon) => { setEditing(c); setDialogOpen(true); };
  const handleDelete = (c: AdminCoupon) => {
    if (confirm(`Delete coupon \"\${c.code}\"? This cannot be undone.`)) {
      deleteMutation.mutate(c.id);
    }
  };

  const handleSubmit = async (payload: CreateCouponPayload) => {
    if (editing) await updateMutation.mutateAsync({ id: editing.id, payload });
    else await createMutation.mutateAsync(payload);
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setSearch(searchInput); setPage(1);
  };

  const coupons = data?.data ?? [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Ticket className="size-7 text-primary" />Coupons
          </h1>
          <p className="text-muted-foreground mt-1">Manage discount coupons available on the platform</p>
        </div>
        <Button onClick={handleAdd}><Plus className="size-4 me-2" />Add Coupon</Button>
      </motion.div>

      <motion.form variants={fadeUp} initial="hidden" animate="visible"
        onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by code..." value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} className="ps-9 font-mono" />
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
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>Try Again</Button>
        </div>
      )}

      {data && coupons.length === 0 && (
        <EmptyState
          icon={Ticket}
          title={search ? 'No coupons match your search' : 'No coupons yet'}
          description={search ? 'Try a different code.' : 'Create your first coupon to offer discounts to your customers.'}
          actionLabel={search ? 'Clear Search' : 'Create Coupon'}
          onAction={search ? () => { setSearch(''); setSearchInput(''); setPage(1); } : handleAdd}
        />
      )}

      {data && coupons.length > 0 && (
        <>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {coupons.map((coupon) => (
              <motion.div key={coupon.id} variants={staggerItem}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
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
                    {coupon.used_at && <span>Used: {new Date(coupon.used_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border \${
                  coupon.is_used
                    ? 'bg-muted text-muted-foreground border-border'
                    : 'bg-success/10 text-success border-success/30'
                }`}>
                  {coupon.is_used ? (<><XCircle className="size-3" />Used</>) : (<><CheckCircle2 className="size-3" />Available</>)}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)} title="Edit">
                    <Edit2 className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon)}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:bg-destructive/10" title="Delete">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button variant="outline" disabled={!data.links.prev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <span className="text-sm text-muted-foreground">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <Button variant="outline" disabled={!data.links.next}
                onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      <CouponFormDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        coupon={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </motion.div>
  );
}
"@

Write-Host "`n=== Done part 2 (big files) ===`n" -ForegroundColor Cyan
