import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

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
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}`);
      return start > new Date();
    },
    {
      message: 'Start time must be in the future',
      path: ['date'],
    }
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

  // ESC key handler + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createBooking.isPending) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, createBooking.isPending]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        date: defaultDate,
        startTime: '10:00',
        endTime: '12:00',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Calculate duration + total
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
  } catch {
    // Invalid date — ignore
  }

  const onSubmit = async (data: BookingFormData) => {
    // Format as YYYY-MM-DD HH:mm:ss (no timezone conversion)
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
    if (e.target === e.currentTarget && !createBooking.isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-modal">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold">Book This Space</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {spaceName}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start / End Time */}
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
                        <Input type="time" {...field} />
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
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Summary */}
              {duration > 0 && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {duration.toFixed(1)} hours
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per hour</span>
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

              {/* Note */}
              <div className="flex items-start gap-2 p-3 bg-info/5 border border-info/20 rounded-lg text-xs">
                <AlertCircle className="size-3.5 text-info shrink-0 mt-0.5" />
                <span className="text-info">
                  You'll be redirected to payment after booking. The owner will
                  be notified to confirm your booking.
                </span>
              </div>

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
                  disabled={createBooking.isPending || duration <= 0}
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
        </div>
      </div>
    </div>
  );
}