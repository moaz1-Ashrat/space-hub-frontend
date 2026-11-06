// src/components/charts/DonutChart.tsx
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { mergeOptions, CHART_PALETTE } from '@/lib/charts/ApexConfig';

interface DonutChartProps {
  labels: string[];
  series: number[];
  height?: number;
}

export function DonutChart({
  labels,
  series,
  height = 300,
}: DonutChartProps) {
  const options: ApexOptions = mergeOptions({
    chart: { type: 'donut' },
    colors: CHART_PALETTE,
    labels,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              formatter: () => series.reduce((a, b) => a + b, 0).toString(),
            },
            value: { fontSize: '20px', fontWeight: 600 },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: { enabled: false },
  });

  return (
    <ReactApexChart
      type="donut"
      options={options}
      series={series}
      height={height}
    />
  );
}