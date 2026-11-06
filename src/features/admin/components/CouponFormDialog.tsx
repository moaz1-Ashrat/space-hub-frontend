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
  user_id: z.union([z.string(), z.number(), z.null()])
    .transform((v) => (v === '' || v === undefined || v === null ? null : Number(v))),
  discount_value: z.coerce.number().min(0, 'Must be >= 0'),
  commission_rate: z.union([z.string(), z.number(), z.null()])
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
