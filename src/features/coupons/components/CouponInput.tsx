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
