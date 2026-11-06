// src/components/charts/AreaChart.tsx
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { mergeOptions, CHART_COLORS } from '@/lib/charts/ApexConfig';

interface AreaChartProps {
  labels: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  height?: number;
  currency?: string;
}

export function AreaChart({
  labels,
  series,
  height = 300,
  currency,
}: AreaChartProps) {
  const options: ApexOptions = mergeOptions({
    chart: { type: 'area' },
    colors: series.map(
      (s, i) =>
        s.color || CHART_COLORS[
          (['primary', 'secondary', 'success'] as const)[i % 3]
        ]
    ),
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: '11px' },
        rotate: labels.length > 6 ? -45 : 0,
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) =>
          currency
            ? `${val.toFixed(0)} ${currency}`
            : val.toFixed(0),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          currency
            ? `${val.toFixed(2)} ${currency}`
            : val.toFixed(2),
      },
    },
    legend: { show: series.length > 1 },
  });

  return (
    <ReactApexChart
      type="area"
      options={options}
      series={series}
      height={height}
    />
  );
}