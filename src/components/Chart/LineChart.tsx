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
        height={500}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        {yAxisKeys?.map((yAxisKey) => (
          <YAxis dataKey={yAxisKey} key={yAxisKey} />
        ))}
        <Tooltip />
        <Legend />
        {yAxisKeys?.map((yAxisKey) => (
          <Line
            key={yAxisKey}
            type="monotone"
            dataKey={yAxisKey}
            stroke={randomColor}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default VisualizationLineChart;
