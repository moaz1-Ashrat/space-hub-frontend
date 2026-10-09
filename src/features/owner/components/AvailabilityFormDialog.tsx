// src/features/owner/components/AvailabilityFormDialog.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Clock, Sparkles, Calendar } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

import { DAY_NAMES, type Availability, type AvailabilityPayload } from '../types';

const schema = z
  .object({
    day_of_week: z.coerce.number().min(0).max(6),
    start_time: z.string().min(1, 'Required'),
    end_time: z.string().min(1, 'Required'),
    is_available: z.boolean().default(true),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: 'End time must be after start time',
    path: ['end_time'],
  });

type FormData = z.infer<typeof schema>;

interface AvailabilityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability?: Availability | null;
  onSubmit: (payload: AvailabilityPayload) => Promise<void>;
  onSubmitBatch?: (payloads: AvailabilityPayload[]) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Compute the next concrete date for a given day_of_week.
 * If today is that day, use next week.
 */
function getNextDateForDay(dayOfWeek: number): string {
  const today = new Date();
  const todayDay = today.getDay();
  let daysAhead = (dayOfWeek - todayDay + 7) % 7;
  // If today is the day, use next week's occurrence
  if (daysAhead === 0) daysAhead = 7;

  const next = new Date(today);
  next.setDate(today.getDate() + daysAhead);

  return next.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AvailabilityFormDialog({
  open,
  onOpenChange,
  availability,
  onSubmit,
  onSubmitBatch,
  isSubmitting,
}: AvailabilityFormDialogProps) {
  const isEdit = !!availability;
  const [applyToAllWeek, setApplyToAllWeek] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      is_available: true,
    },
  });

  const dayOfWeek = form.watch('day_of_week');

  useEffect(() => {
    if (open) {
      setApplyToAllWeek(false);
      if (availability) {
        form.reset({
          day_of_week: availability.day_of_week,
          start_time: availability.start_time.slice(0, 5),
          end_time: availability.end_time.slice(0, 5),
          is_available: availability.is_available,
        });
      } else {
        form.reset({
          day_of_week: 1,
          start_time: '09:00',
          end_time: '17:00',
          is_available: true,
        });
      }
    }
  }, [open, availability, form]);

  const handleSubmit = async (data: FormData) => {
    const payload: AvailabilityPayload = {
      day_of_week: data.day_of_week,
      start_time: `${data.start_time}:00`,
      end_time: `${data.end_time}:00`,
      is_available: data.is_available,
    };

    if (applyToAllWeek && !isEdit && onSubmitBatch) {
      const payloads: AvailabilityPayload[] = [];
      for (let day = 0; day <= 6; day++) {
        payloads.push({ ...payload, day_of_week: day });
      }
      await onSubmitBatch(payloads);
    } else {
      await onSubmit(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            {isEdit ? 'Edit Availability' : 'Add Availability Slot'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this slot’s time or availability'
              : 'Set the weekly day and hours when your space is bookable'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Day of Week */}
            <FormField
              control={form.control}
              name="day_of_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAY_NAMES.map((day, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Next Date Preview */}
            {!applyToAllWeek && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                <Calendar className="size-3.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-primary block mb-0.5">
                    Repeats every {DAY_NAMES[dayOfWeek]}
                  </span>
                  <span className="text-muted-foreground">
                    Next available: {getNextDateForDay(dayOfWeek)}
                  </span>
                </div>
              </div>
            )}

            {/* Apply to all 7 days */}
            {!isEdit && (
              <button
                type="button"
                onClick={() => setApplyToAllWeek(!applyToAllWeek)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  applyToAllWeek
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-muted/30 border-border hover:border-primary/30'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                    applyToAllWeek
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background'
                  }`}
                >
                  {applyToAllWeek && <Sparkles className="size-3" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles
                      className={`size-3.5 ${
                        applyToAllWeek
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <span className="font-medium text-sm">
                      Apply to all 7 days
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Creates identical weekly slots for all days
                  </p>
                </div>
              </button>
            )}

            {/* All Week preview */}
            {applyToAllWeek && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-xs">
                <p className="font-medium mb-2">
                  Will create 7 weekly slots for:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DAY_NAMES.map((day, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium"
                    >
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mt-2">
                  Next 7 days: every day of the week will have this slot
                </p>
              </div>
            )}

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Is available */}
            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for booking</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Uncheck to temporarily disable this slot
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="size-4 me-2 animate-spin" />
                )}
                {isEdit
                  ? 'Save Changes'
                  : applyToAllWeek
                  ? 'Create 7 Slots'
                  : 'Add Slot'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}