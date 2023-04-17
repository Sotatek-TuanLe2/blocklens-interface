import React from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartProps } from './LineChart';
import { COLORS, randomColor } from '../../utils/common';
import { CustomTooltip, renderLegend, tickFormatTime } from './BarChart';

type Props = ChartProps;
const VisualizationAreaChart = ({ data, xAxisKey, yAxisKeys }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        className="area-chart"
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={xAxisKey === 'time' ? tickFormatTime : undefined}
        />
        {yAxisKeys?.map((yAxisKey) => (
          <YAxis dataKey={yAxisKey} key={yAxisKey} />
        ))}
        {yAxisKeys?.map((yAxisKey, index) => (
          <Area
            key={yAxisKey}
            dataKey={yAxisKey}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
        <Tooltip
          content={<CustomTooltip />}
          animationDuration={200}
          animationEasing={'linear'}
        />

        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          content={renderLegend}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VisualizationAreaChart;
