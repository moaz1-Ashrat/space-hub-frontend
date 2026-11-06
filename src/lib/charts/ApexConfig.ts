// src/lib/charts/ApexConfig.ts
import type { ApexOptions } from 'apexcharts';

/**
 * ApexCharts — Base Theme
 *
 * يحترم:
 * - Dark Mode
 * - RTL (Arabic)
 * - Tailwind design tokens
 */

export const CHART_COLORS = {
  primary: '#4F46E5', // Indigo
  secondary: '#14B8A6', // Teal
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red
  info: '#0EA5E9', // Sky
  purple: '#A855F7', // Purple
  gray: '#6B7280',
};

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.danger,
];

/**
 * Detect dark mode + RTL from DOM.
 * Called at render time (client-side).
 */
export function getChartContext() {
  if (typeof document === 'undefined') {
    return { isDark: false, isRtl: false };
  }
  const isDark = document.documentElement.classList.contains('dark');
  const isRtl = document.documentElement.dir === 'rtl';
  return { isDark, isRtl };
}

/**
 * Base options that apply to all charts.
 */
export function getBaseOptions(): ApexOptions {
  const { isDark, isRtl } = getChartContext();
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  return {
    chart: {
      fontFamily: 'Inter, Cairo, sans-serif',
      foreColor: textColor,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
      },
      background: 'transparent',
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
    },
    dataLabels: { enabled: false },
    legend: {
      labels: { colors: mutedColor },
      markers: { size: 6 },
      position: 'bottom',
    },
    xaxis: {
      labels: { style: { colors: mutedColor, fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: mutedColor, fontSize: '11px' } },
    },
    // RTL handled per-chart if needed
    ...(isRtl ? { chart: { ...({} as any) } } : {}),
  } as ApexOptions;
}

/**
 * Merge base options with chart-specific ones.
 */
export function mergeOptions(specific: ApexOptions): ApexOptions {
  const base = getBaseOptions();
  return {
    ...base,
    ...specific,
    chart: { ...base.chart, ...specific.chart },
    grid: { ...base.grid, ...specific.grid },
    tooltip: { ...base.tooltip, ...specific.tooltip },
    xaxis: { ...base.xaxis, ...specific.xaxis },
    yaxis: { ...base.yaxis, ...specific.yaxis },
  };
}