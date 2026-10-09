// src/features/owner/components/AvailabilityCard.tsx
import { motion } from 'framer-motion';
import { Clock, Edit2, Trash2, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DAY_NAMES, type Availability } from '../types';

interface AvailabilityCardProps {
  availability: Availability;
  onEdit: (a: Availability) => void;
  onDelete: (id: number) => void;
}

export function AvailabilityCard({
  availability,
  onEdit,
  onDelete,
}: AvailabilityCardProps) {
  const formatTime = (time: string) => time.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
    >
      {/* Day badge */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex flex-col items-center justify-center shrink-0">
        <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">
          {DAY_NAMES[availability.day_of_week]?.slice(0, 3)}
        </span>
        <span className="text-[9px] font-medium text-muted-foreground mt-0.5">
          #{availability.day_of_week + 1}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm flex items-center gap-2 flex-wrap">
          {DAY_NAMES[availability.day_of_week]}
          {availability.special_date && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning/15 text-warning text-[10px] font-medium">
              <Calendar className="size-3" />
              {availability.special_date}
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
          <Clock className="size-3.5" />
          <span className="font-mono">
            {formatTime(availability.start_time)} →{' '}
            {formatTime(availability.end_time)}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <div
        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          availability.is_available
            ? 'bg-success/10 text-success border-success/30'
            : 'bg-muted text-muted-foreground border-border'
        }`}
      >
        {availability.is_available ? (
          <>
            <CheckCircle2 className="size-3" />
            Available
          </>
        ) : (
          <>
            <XCircle className="size-3" />
            Disabled
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(availability)}
          title="Edit"
        >
          <Edit2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(availability.id)}
          className="text-destructive hover:bg-destructive/10"
          title="Delete"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}