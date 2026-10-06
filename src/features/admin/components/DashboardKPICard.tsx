import type { LucideIcon } from 'lucide-react';

interface DashboardKPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'error';
  suffix?: string;
  formatted?: boolean;
}

const colorConfig = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
  },
  info: {
    bg: 'bg-info/10',
    icon: 'text-info',
  },
  error: {
    bg: 'bg-error/10',
    icon: 'text-error',
  },
};

export function DashboardKPICard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  suffix,
  formatted = false,
}: DashboardKPICardProps) {
  const colors = colorConfig[color];

  const displayValue = formatted
    ? Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : value;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`size-5 ${colors.icon}`} />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold font-mono truncate">
            {displayValue}
            {suffix && (
              <span className="text-sm font-normal text-muted-foreground ms-1">
                {suffix}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{title}</div>
        </div>
      </div>
    </div>
  );
}