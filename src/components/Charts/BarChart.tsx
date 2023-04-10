import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from './LineChart';
import { getHourAndMinute, randomColor } from '../../utils/common';

type Props = ChartProps;
const VisualizationBarChart = ({ xAxisKey, yAxisKeys, data }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <BarChart height={500} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={(value) => {
            return getHourAndMinute(new Date(value));
          }}
        />
        {yAxisKeys?.map((yKey) => (
          <YAxis key={yKey} dataKey={yKey} />
        ))}
        <Tooltip />
        <Legend />
        {yAxisKeys?.map((yKey) => (
          <Bar key={yKey} dataKey={yKey} fill={randomColor} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VisualizationBarChart;
