// src/components/charts/LineChart.tsx
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { mergeOptions, CHART_COLORS } from '@/lib/charts/ApexConfig';

interface LineChartProps {
  labels: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  height?: number;
}

export function LineChart({
  labels,
  series,
  height = 300,
}: LineChartProps) {
  const options: ApexOptions = mergeOptions({
    chart: { type: 'line' },
    colors: series.map(
      (s, i) =>
        s.color || CHART_COLORS[
          (['primary', 'secondary', 'success'] as const)[i % 3]
        ]
    ),
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: {
      categories: labels,
      labels: { rotate: labels.length > 6 ? -45 : 0 },
    },
    legend: { show: true },
  });

  return (
    <ReactApexChart
      type="line"
      options={options}
      series={series}
      height={height}
    />
  );
}