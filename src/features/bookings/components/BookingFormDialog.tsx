// src/features/bookings/components/BookingFormDialog.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useCreateBooking } from '../hooks/useCreateBooking';
import { useSpaceAvailability } from '@/features/spaces/hooks/useSpaceAvailability';
import { DAY_NAMES, type Availability } from '@/features/owner/types';

interface BookingFormDialogProps {
  spaceId: number;
  spaceName: string;
  pricePerHour: number;
  isOpen: boolean;
  onClose: () => void;
}

const bookingSchema = z
  .object({
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}`);
      const end = new Date(`${data.date}T${data.endTime}`);
      return end > start;
    },
    { message: 'End time must be after start time', path: ['endTime'] }
  );

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingFormDialog({
  spaceId,
  spaceName,
  pricePerHour,
  isOpen,
  onClose,
}: BookingFormDialogProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();

  // ✅ Load availability
  const { data: availabilityData, isLoading: loadingAvailability } =
    useSpaceAvailability(spaceId);
  const availability = availabilityData?.data ?? [];
  const activeSlots = availability.filter((a) => a.is_available);

  // Default date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: defaultDate,
      startTime: '10:00',
      endTime: '12:00',
    },
  });

  const date = form.watch('date');
  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');

  // ✅ Get day of week (0=Sun, 6=Sat)
  const selectedDay = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + 'T00:00:00');
    return d.getDay();
  }, [date]);

  // ✅ Find slots for the selected day
  const slotsForDay = useMemo(() => {
    if (selectedDay === null) return [];
    return activeSlots.filter((a) => a.day_of_week === selectedDay);
  }, [activeSlots, selectedDay]);

  const isDayAvailable = slotsForDay.length > 0;

  // ✅ Get min/max times from slots
  const timeRange = useMemo(() => {
    if (slotsForDay.length === 0) return null;
    const minStart = slotsForDay.reduce((min, s) =>
      s.start_time < min ? s.start_time : min, slotsForDay[0].start_time
    );
    const maxEnd = slotsForDay.reduce((max, s) =>
      s.end_time > max ? s.end_time : max, slotsForDay[0].end_time
    );
    return { minStart: minStart.slice(0, 5), maxEnd: maxEnd.slice(0, 5) };
  }, [slotsForDay]);

  // ✅ Check if selected time is within availability
  const timeValidation = useMemo(() => {
    if (!isDayAvailable || !startTime || !endTime) {
      return { valid: false, message: '' };
    }

    const start = startTime + ':00';
    const end = endTime + ':00';

    // Must fit within at least one slot
    const fits = slotsForDay.some(
      (s) => start >= s.start_time && end <= s.end_time
    );

    if (!fits) {
      return {
        valid: false,
        message: `Selected time is outside available hours (${slotsForDay
          .map((s) => `${s.start_time.slice(0, 5)}-${s.end_time.slice(0, 5)}`)
          .join(', ')})`,
      };
    }

    return { valid: true, message: '' };
  }, [slotsForDay, isDayAvailable, startTime, endTime]);

  // ESC + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createBooking.isPending) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, createBooking.isPending]);

  // ✅ Reset on open with smart defaults
  useEffect(() => {
    if (isOpen && isDayAvailable && timeRange) {
      form.reset({
        date: defaultDate,
        startTime: timeRange.minStart,
        endTime: timeRange.maxEnd,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ✅ Auto-adjust time if day changes
  useEffect(() => {
    if (isDayAvailable && timeRange && isOpen) {
      const currentStart = form.getValues('startTime');
      if (currentStart < timeRange.minStart || currentStart > timeRange.maxEnd) {
        form.setValue('startTime', timeRange.minStart);
        form.setValue('endTime', timeRange.maxEnd);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, isDayAvailable]);

  // Duration + Total
  let duration = 0;
  let total = 0;
  try {
    if (date && startTime && endTime) {
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (hours > 0) {
        duration = hours;
        total = hours * pricePerHour;
      }
    }
  } catch {}

  const onSubmit = async (data: BookingFormData) => {
    const startDateTime = `${data.date} ${data.startTime}:00`;
    const endDateTime = `${data.date} ${data.endTime}:00`;

    const result = await createBooking.mutateAsync({
      space_id: spaceId,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
    });

    navigate(`/customer/bookings/${result.data.id}/checkout`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !createBooking.isPending) onClose();
  };

  if (!isOpen) return null;

  // ✅ Loading state
  if (loadingAvailability) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center">
          <Loader2 className="size-8 mx-auto animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">
            Loading availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-modal max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold">Book This Space</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {spaceName}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* ✅ No availability warning */}
          {activeSlots.length === 0 ? (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="size-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-warning mb-1">
                    Not available for booking yet
                  </p>
                  <p className="text-muted-foreground">
                    The owner hasn't set up any time slots. Please check back
                    later.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} min={defaultDate} />
                      </FormControl>
                      {date && selectedDay !== null && (
                        <div className="text-xs text-muted-foreground">
                          {DAY_NAMES[selectedDay]}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Day availability indicator */}
                {date && selectedDay !== null && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      isDayAvailable
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}
                  >
                    {isDayAvailable ? (
                      <>
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span className="font-medium">
                          Available on {DAY_NAMES[selectedDay]}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 shrink-0" />
                        <span className="font-medium">
                          Not available on {DAY_NAMES[selectedDay]}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Available hours info */}
                {isDayAvailable && slotsForDay.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-info/5 border border-info/20 rounded-lg text-xs">
                    <Info className="size-3.5 text-info shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-info block mb-1">
                        Available hours:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {slotsForDay.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-info/10 text-info font-mono"
                          >
                            <Clock className="size-3" />
                            {s.start_time.slice(0, 5)} → {s.end_time.slice(0, 5)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Times */}
                {isDayAvailable && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            Start
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              min={timeRange?.minStart}
                              max={timeRange?.maxEnd}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            End
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              min={timeRange?.minStart}
                              max={timeRange?.maxEnd}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Time validation error */}
                {isDayAvailable &&
                  !timeValidation.valid &&
                  timeValidation.message && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                      {timeValidation.message}
                    </div>
                  )}

                {/* Summary */}
                {isDayAvailable && duration > 0 && timeValidation.valid && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {duration.toFixed(1)} hours
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Price per hour
                      </span>
                      <span className="font-mono">
                        {pricePerHour.toFixed(2)} EGP
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-primary/20">
                      <span className="font-semibold">Total</span>
                      <span className="font-mono font-bold text-primary text-lg">
                        {total.toFixed(2)} EGP
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={createBooking.isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createBooking.isPending ||
                      !isDayAvailable ||
                      !timeValidation.valid ||
                      duration <= 0
                    }
                    className="flex-1"
                  >
                    {createBooking.isPending && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {createBooking.isPending ? 'Booking...' : 'Book Now'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}