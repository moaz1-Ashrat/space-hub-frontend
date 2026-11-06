// src/components/charts/BarChart.tsx
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { mergeOptions, CHART_COLORS } from '@/lib/charts/ApexConfig';

interface BarChartProps {
  labels: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  height?: number;
  horizontal?: boolean;
}

export function BarChart({
  labels,
  series,
  height = 300,
  horizontal = false,
}: BarChartProps) {
  const options: ApexOptions = mergeOptions({
    chart: { type: 'bar' },
    colors: series.map(
      (s, i) =>
        s.color || CHART_COLORS[
          (['primary', 'secondary', 'info'] as const)[i % 3]
        ]
    ),
    plotOptions: {
      bar: {
        horizontal,
        borderRadius: 6,
        borderRadiusApplication: 'end',
        columnWidth: '60%',
        distributed: series.length === 1,
      },
    },
    dataLabels: { enabled: false },
    xaxis: horizontal
      ? { categories: labels }
      : { categories: labels, labels: { rotate: labels.length > 6 ? -45 : 0 } },
    yaxis: horizontal
      ? { labels: { formatter: (val: number) => val.toFixed(0) } }
      : {},
    legend: { show: series.length > 1 },
  });

  return (
    <ReactApexChart
      type="bar"
      options={options}
      series={series}
      height={height}
    />
  );
}