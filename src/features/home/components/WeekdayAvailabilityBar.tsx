import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
type AvailabilityCount = { day_of_week: number; count: number };
type AvailabilityResponse = AvailabilityCount[] | { data: AvailabilityCount[] | Record<string, number> };

export function WeekdayAvailabilityBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');

  const { data, isLoading } = useQuery({
    queryKey: ['weekday-availability'],
    queryFn: async () => {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      // التعديل هنا: إضافة /v1
      const { data } = await apiClient.get<AvailabilityResponse>(`/calendar/available-space-counts?month=${month}`);
      return data; 
    }
  });

  if (isLoading) return <div className="h-24 bg-muted animate-pulse rounded-xl mb-8" />;

  let availability: AvailabilityCount[] = [];
  if (data) {
    if (Array.isArray(data)) availability = data;
    else if (data.data && Array.isArray(data.data)) availability = data.data;
    else if (data.data && !Array.isArray(data.data)) {
      const counts = data.data as Record<string, number>;
      availability = Object.keys(data.data).map((key) => ({
        day_of_week: parseInt(key, 10),
        count: counts[key],
      }));
    }
  }

  const handleDayClick = (index: number) => {
    if (selectedDay === String(index)) {
      searchParams.delete('day');
    } else {
      searchParams.set('day', String(index));
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 shadow-sm mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <CalendarDays className="size-5" />
          <span className="text-base">Spaces Availability by Day</span>
        </div>
        {selectedDay !== null && (
          <button onClick={() => { searchParams.delete('day'); setSearchParams(searchParams); }} className="text-xs text-destructive hover:underline font-medium">
            Clear Filter
          </button>
        )}
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {DAYS.map((dayName, index) => {
          const dayData = availability.find((d) => Number(d.day_of_week) === index);
          const count = dayData ? dayData.count : 0;
          const isSelected = selectedDay === String(index);

          return (
            <motion.button 
              key={index}
              onClick={() => handleDayClick(index)}
              whileHover={{ y: -2 }}
              className={`flex-1 min-w-[90px] flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                  : 'bg-muted/50 border-border hover:border-primary/50'
              }`}
            >
              <span className={`text-xs mb-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{dayName}</span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : (count > 0 ? 'text-primary' : 'text-destructive')}`}>
                {count}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>Spaces</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}