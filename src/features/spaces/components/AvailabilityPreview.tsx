// src/features/spaces/components/AvailabilityPreview.tsx
import { Calendar, Clock, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DAY_NAMES, type Availability } from '@/features/owner/types';

interface AvailabilityPreviewProps {
  availability: Availability[];
  className?: string;
}

export function AvailabilityPreview({
  availability,
  className,
}: AvailabilityPreviewProps) {
  const activeSlots = availability.filter((a) => a.is_available);

  // Group by day
  const slotsByDay = activeSlots.reduce<Record<number, Availability[]>>(
    (acc, slot) => {
      if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
      acc[slot.day_of_week].push(slot);
      return acc;
    },
    {}
  );

  const daysWithSlots = Object.keys(slotsByDay)
    .map(Number)
    .sort((a, b) => a - b);

  const hasAvailability = daysWithSlots.length > 0;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="size-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">
          Weekly Availability
        </h3>
        {hasAvailability && (
          <span className="ms-auto text-xs text-muted-foreground">
            {daysWithSlots.length}{' '}
            {daysWithSlots.length === 1 ? 'day' : 'days'} available
          </span>
        )}
      </div>

      {!hasAvailability ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-warning/5 border border-warning/20 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <Info className="size-4 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-warning">
                No availability set up yet
              </p>
              <p className="text-muted-foreground mt-0.5">
                This space hasn't configured its weekly time slots yet. Please
                check back later.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {daysWithSlots.map((day, idx) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
            >
              {/* Day badge */}
              <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">
                  {DAY_NAMES[day]?.slice(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Day name */}
              <span className="font-medium text-sm w-20 shrink-0">
                {DAY_NAMES[day]}
              </span>

              {/* Slots */}
              <div className="flex flex-wrap gap-2 flex-1">
                {slotsByDay[day].map((slot) => (
                  <span
                    key={slot.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono font-medium"
                  >
                    <Clock className="size-3" />
                    {slot.start_time.slice(0, 5)} → {slot.end_time.slice(0, 5)}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}