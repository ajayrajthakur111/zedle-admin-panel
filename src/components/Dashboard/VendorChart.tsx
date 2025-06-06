// src/components/Dashboard/VendorChart.tsx
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type DotProps,
} from 'recharts';
import type { Payload as LegendPayload } from 'recharts/types/component/DefaultLegendContent';
import { getChartData, type ChartPoint } from '@/api/authService';

import { Loader2, AlertTriangle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const COLORS = {
  january: { stroke: '#F59E0B', fill: 'rgba(245, 158, 11, 0.35)' },
  february: { stroke: '#2DD4BF', fill: 'rgba(45, 212, 191, 0.25)' },
  march: { stroke: '#F472B6', fill: 'rgba(244, 114, 182, 0.25)' },
  april: { stroke: '#A78BFA', fill: 'rgba(167, 139, 250, 0.25)' },
};

const CustomizedDot: React.FC<DotProps & { color?: string }> = (props) => {
  const { cx, cy, color } = props;
  if (cx == null || cy == null) return null;
  return (
    <svg x={cx - 5} y={cy - 5} width={10} height={10} viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="4" fill="#FFFFFF" stroke={color || '#000000'} strokeWidth={1.5} />
    </svg>
  );
};

const renderLegend = (props: { payload?: LegendPayload[] }) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <ul className="flex items-center justify-center space-x-4 mt-3">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export const VendorChart: React.FC = () => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [ticks, setTicks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getChartData();
        setData(res);

        // Compute max value across all months:
        const allValues = res.flatMap((pt) => [pt.january, pt.february, pt.march, pt.april]);
        const maxValue = Math.max(...allValues, 0);

        // Build a tick array: [0, max/4, max/2, 3*max/4, max], rounded up
        if (maxValue > 0) {
          const step = Math.ceil(maxValue / 4);
          const computedTicks = [0, step, 2 * step, 3 * step, 4 * step];
          setTicks(computedTicks);
        } else {
          setTicks([0]);
        }
      } catch (e) {
        setError('Failed to load chart data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardContainerClasses = 'bg-purple-50 rounded-xl shadow-lg p-2  w-full flex flex-col border border-[#ca90c4] mt-4';
  const chartAreaHeight = 'h-[350px]';

  if (loading) {
    return (
      <div className={twMerge(cardContainerClasses, 'items-center justify-center', chartAreaHeight)}>
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <span className="text-primary font-medium">Loading chart…</span>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className={twMerge(cardContainerClasses, 'items-center justify-center text-center', chartAreaHeight)}>
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-destructive font-semibold">{error || 'No chart data.'}</p>
      </div>
    );
  }

  return (
    <div className={twMerge(cardContainerClasses)}>
      <h3 className="text-md font-poppins font-semibold   text-primary text-center mb-4 shrink-0">
        Vendor wise Orders
      </h3>
      <div className={twMerge('relative w-full', chartAreaHeight)}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 5,   
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--zedle-ui-border, #e5e7eb)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="vendor"
              axisLine={{ stroke: 'var(--zedle-ui-border, #e5e7eb)' }}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--zedle-text-primary, #1F2937)' }}
              dy={10}
            />
            <YAxis
              axisLine={{ stroke: 'var(--zedle-ui-border, #e5e7eb)' }}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--zedle-text-primary, #1F2937)' }}
              ticks={ticks}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--zedle-bg-card, #fff)',
                borderColor: 'var(--zedle-ui-border, #e5e7eb)',
                borderRadius: '0.375rem',
                padding: '8px 12px',
              }}
              labelStyle={{
                color: 'var(--zedle-text-primary, #1f2937)',
                fontWeight: '600',
                marginBottom: '4px',
              }}
              itemStyle={{ color: 'var(--zedle-text-secondary, #6b7280)', fontSize: '12px' }}
              cursor={{ stroke: 'var(--zedle-brand-purple-light)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Legend content={renderLegend} verticalAlign="bottom" wrapperStyle={{ paddingTop: '15px' }} />

            <Area
              type="natural"
              dataKey="april"
              stroke={COLORS.april.stroke}
              fill={COLORS.april.fill}
              strokeWidth={1.5}
              name="April"
              dot={<CustomizedDot color={COLORS.april.stroke} />}
              activeDot={<CustomizedDot color={COLORS.april.stroke} />}
            />
            <Area
              type="natural"
              dataKey="march"
              stroke={COLORS.march.stroke}
              fill={COLORS.march.fill}
              strokeWidth={1.5}
              name="March"
              dot={<CustomizedDot color={COLORS.march.stroke} />}
              activeDot={<CustomizedDot color={COLORS.march.stroke} />}
            />
            <Area
              type="natural"
              dataKey="february"
              stroke={COLORS.february.stroke}
              fill={COLORS.february.fill}
              strokeWidth={1.5}
              name="February"
              dot={<CustomizedDot color={COLORS.february.stroke} />}
              activeDot={<CustomizedDot color={COLORS.february.stroke} />}
            />
            <Area
              type="natural"
              dataKey="january"
              stroke={COLORS.january.stroke}
              fill={COLORS.january.fill}
              strokeWidth={1.5}
              name="January"
              dot={<CustomizedDot color={COLORS.january.stroke} />}
              activeDot={<CustomizedDot color={COLORS.january.stroke} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
