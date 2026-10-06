import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface EarningsCardProps {
  totalRevenue: number;
  totalCommission: number;
  totalPayout: number;
  averageRate: number;
}

export function EarningsCard({
  totalRevenue,
  totalCommission,
  totalPayout,
  averageRate,
}: EarningsCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="size-5" />
        <h3 className="font-heading font-semibold text-lg">Total Earnings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs text-white/70">Your Payout</div>
          <div className="text-4xl font-bold font-mono flex items-center gap-2">
            <DollarSign className="size-8" />
            {totalPayout.toFixed(2)}
          </div>
          <div className="text-xs text-white/70 mt-1">EGP</div>
        </div>

        <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-white/70">Total Revenue</div>
            <div className="font-mono font-semibold text-lg">
              {totalRevenue.toFixed(2)} EGP
            </div>
          </div>

          <div>
            <div className="text-xs text-white/70 flex items-center gap-1">
              <Percent className="size-3" />
              Avg. Commission
            </div>
            <div className="font-mono font-semibold text-lg">
              {(averageRate * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/20">
          <div className="text-xs text-white/70">Platform Commission</div>
          <div className="font-mono font-medium">
            -{totalCommission.toFixed(2)} EGP
          </div>
        </div>
      </div>
    </div>
  );
}