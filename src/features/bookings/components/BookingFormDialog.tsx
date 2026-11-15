import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useCreateBooking } from '../hooks/useCreateBooking';
import { useSpaceAvailability } from '@/features/spaces/hooks/useSpaceAvailability';
import { DAY_NAMES } from '@/features/owner/types';
import { CouponInput } from '@/features/coupons/components/CouponInput';
import type { Coupon } from '@/features/coupons/types';
import type { CreateBookingPayload } from '../types';
import { getErrorMessage } from '@/lib/errors';

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

export function BookingFormDialog({ spaceId, spaceName, pricePerHour, isOpen, onClose }: BookingFormDialogProps) {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  
  // استخدام useRef عشان نمنع الـ Infinite Loop
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isThirdParty, setIsThirdParty] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [submitError, setSubmitError] = useState('');

  // 1. Fetch Availability
  const { data: availabilityData, isLoading: loadingAvailability } = useSpaceAvailability(spaceId);
  const availability = availabilityData?.data ?? [];
  const activeSlots = availability.filter((a) => a.is_available);

  // 2. Setup Date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: defaultDate, startTime: '10:00', endTime: '12:00' },
  });

  const date = form.watch('date');
  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');

  // 3. Fetch Fully Booked Dates
  const selectedMonth = date ? date.substring(0, 7) : defaultDate.substring(0, 7);
  const { data: fullyBookedData } = useQuery({
    queryKey: ['fully-booked-dates', spaceId, selectedMonth],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        data?: { fully_booked_dates?: string[] };
      }>('/calendar/fully-booked-dates', {
        params: { month: selectedMonth, space_id: spaceId } 
      });
      return data.data?.fully_booked_dates ?? [];
    },
    enabled: isOpen && !!date,
  });

  const fullyBookedDates: string[] = useMemo(() => {
    if (!fullyBookedData) return [];
    if (Array.isArray(fullyBookedData)) {
      return fullyBookedData.flatMap((entry: unknown) => {
        if (typeof entry === 'string') return [entry];
        if (
          typeof entry === 'object' &&
          entry !== null &&
          'date' in entry &&
          typeof entry.date === 'string'
        ) {
          return [entry.date];
        }
        return [];
      });
    }
    return [];
  }, [fullyBookedData]);

  const isSelectedDateFullyBooked = Array.isArray(fullyBookedDates) && fullyBookedDates.includes(date);

  // 4. Day Logic
  const selectedDay = useMemo(() => (date ? new Date(date + 'T00:00:00').getDay() : null), [date]);
  const slotsForDay = useMemo(() => selectedDay === null ? [] : activeSlots.filter((a) => a.day_of_week === selectedDay), [activeSlots, selectedDay]);
  const isDayAvailable = slotsForDay.length > 0 && !isSelectedDateFullyBooked;

  const timeRange = useMemo(() => {
    if (slotsForDay.length === 0) return null;
    const minStart = slotsForDay.reduce((min, s) => s.start_time < min ? s.start_time : min, slotsForDay[0].start_time);
    const maxEnd = slotsForDay.reduce((max, s) => s.end_time > max ? s.end_time : max, slotsForDay[0].end_time);
    return { minStart: minStart.slice(0, 5), maxEnd: maxEnd.slice(0, 5) };
  }, [slotsForDay]);

  const timeValidation = useMemo(() => {
    if (!isDayAvailable || !startTime || !endTime) return { valid: false, message: '' };
    const start = startTime + ':00'; const end = endTime + ':00';
    const fits = slotsForDay.some((s) => start >= s.start_time && end <= s.end_time);
    if (!fits) return { valid: false, message: `Selected time is outside available hours.` };
    return { valid: true, message: '' };
  }, [slotsForDay, isDayAvailable, startTime, endTime]);

  // 5. Effects
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { 
      if (e.key === 'Escape' && !createBooking.isPending) onCloseRef.current(); 
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => { 
      document.removeEventListener('keydown', handleEscape); 
      document.body.style.overflow = ''; 
    };
  }, [isOpen, createBooking.isPending]); // شيلنا onClose من هنا عشان نمنع الـ loop

  useEffect(() => {
    if (isOpen) {
      setCouponCode(''); setAppliedCoupon(null); setIsThirdParty(false); setGuestName(''); setGuestEmail(''); setGuestPhone(''); setSubmitError('');
      if (isDayAvailable && timeRange) form.reset({ date: defaultDate, startTime: timeRange.minStart, endTime: timeRange.maxEnd });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // بنعمل reset بس لما يتفتح

  let duration = 0; let subtotal = 0;
  if (date && startTime && endTime) {
    const hours = (new Date(`${date}T${endTime}`).getTime() - new Date(`${date}T${startTime}`).getTime()) / (1000 * 60 * 60);
    if (hours > 0) { duration = hours; subtotal = hours * pricePerHour; }
  }

  const discount = appliedCoupon?.discount_value ?? 0;
  const finalTotal = Math.max(subtotal - discount, 0);

  const onSubmit = async (data: BookingFormData) => {
    const start = new Date(`${data.date}T${data.startTime}`);
    if (start <= new Date()) {
      setSubmitError('Booking must start in the future. Please choose another time.');
      return;
    }

    setSubmitError('');
    const payload: CreateBookingPayload = { space_id: spaceId, start_datetime: `${data.date} ${data.startTime}:00`, end_datetime: `${data.date} ${data.endTime}:00` };
    if (appliedCoupon) payload.coupon_code = appliedCoupon.code;
    if (isThirdParty) {
      payload.attendee_name = guestName.trim();
      payload.attendee_email = guestEmail.trim();
      payload.attendee_phone = guestPhone.trim();
    }

    createBooking.mutate(payload, {
      onSuccess: (result) => {
        navigate(`/customer/bookings/${result.data.id}/checkout`);
        onCloseRef.current();
      },
      onError: (error) => {
        setSubmitError(getErrorMessage(error));
      },
    });
  };

  if (!isOpen) return null;
  if (loadingAvailability) return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div className="bg-card p-8 rounded-xl"><Loader2 className="size-8 animate-spin text-primary" /></div></div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && !createBooking.isPending && onCloseRef.current()}>
      <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold">Book This Space</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{spaceName}</p>
        </div>

        <div className="p-6 space-y-4">
          {activeSlots.length === 0 ? (
            <div className="p-4 rounded-lg bg-warning/10 text-warning text-sm">Not available for booking yet.</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl><Input type="date" {...field} min={defaultDate} /></FormControl>
                    {date && selectedDay !== null && (
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        {DAY_NAMES[selectedDay]}
                        {isSelectedDateFullyBooked && (
                          <span className="text-destructive font-semibold bg-destructive/10 px-2 py-0.5 rounded">Fully Booked</span>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />

                {isSelectedDateFullyBooked && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>This date is fully booked for this space. Please select another date.</span>
                  </div>
                )}

                {!isSelectedDateFullyBooked && isDayAvailable && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="startTime" render={({ field }) => (
                      <FormItem><FormLabel>Start</FormLabel><FormControl><Input type="time" {...field} min={timeRange?.minStart} max={timeRange?.maxEnd} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="endTime" render={({ field }) => (
                      <FormItem><FormLabel>End</FormLabel><FormControl><Input type="time" {...field} min={timeRange?.minStart} max={timeRange?.maxEnd} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                )}

                {!isSelectedDateFullyBooked && isDayAvailable && duration > 0 && timeValidation.valid && (
                  <>
                    <CouponInput value={couponCode} onChange={setCouponCode} onApply={setAppliedCoupon} />
                    
                    <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-3 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isThirdParty} onChange={(e) => setIsThirdParty(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        <span className="text-sm font-medium">I'm booking for someone else</span>
                      </label>
                      {isThirdParty && (
                        <div className="space-y-3 pt-2">
                          <Input placeholder="Guest Name *" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                          <Input type="email" placeholder="Guest Email *" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                          <Input placeholder="Guest Phone *" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{subtotal.toFixed(2)} EGP</span></div>
                      {appliedCoupon && <div className="flex justify-between text-sm text-success"><span>Discount ({appliedCoupon.code})</span><span className="font-mono">-{discount.toFixed(2)} EGP</span></div>}
                      <div className="flex justify-between pt-2 border-t border-primary/20"><span className="font-semibold">Total</span><span className="font-mono font-bold text-primary text-lg">{finalTotal.toFixed(2)} EGP</span></div>
                    </div>
                  </>
                )}

                {submitError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => onCloseRef.current()} disabled={createBooking.isPending} className="flex-1">Cancel</Button>
                  <Button 
                    type="submit" 
                    disabled={createBooking.isPending || !isDayAvailable || isSelectedDateFullyBooked || !timeValidation.valid || duration <= 0 || (isThirdParty && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()))} 
                    className="flex-1"
                  >
                    {createBooking.isPending && <Loader2 className="size-4 animate-spin me-2" />}
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