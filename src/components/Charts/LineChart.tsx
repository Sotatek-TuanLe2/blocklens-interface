import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { randomColor } from '../../utils/common';
import { CustomTooltip, renderLegend, tickFormatTime } from './BarChart';

export type ChartProps = {
  data?: unknown[];
  xAxisKey?: string;
  yAxisKeys?: string[];
};
type Props = ChartProps;

const VisualizationLineChart = ({ data, xAxisKey, yAxisKeys }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <LineChart
        className="line-chart"
        height={500}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="4" />

        <XAxis
          dataKey={xAxisKey}
          tickFormatter={xAxisKey === 'time' ? tickFormatTime : undefined}
        />
        {yAxisKeys?.map((yAxisKey) => (
          <YAxis dataKey={yAxisKey} key={yAxisKey} />
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
        {yAxisKeys?.map((yAxisKey) => (
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={randomColor}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default VisualizationLineChart;
