import React from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartProps } from './LineChart';
import { randomColor } from '../../utils/common';

type Props = ChartProps;
const VisualizationAreaChart = ({ data, xAxisKey, yAxisKeys }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis dataKey={xAxisKey} />
        {yAxisKeys?.map((yAxisKey) => (
          <YAxis dataKey={yAxisKey} key={yAxisKey} />
        ))}
        {yAxisKeys?.map((yAxisKey) => (
          <Area
            key={yAxisKey}
            dataKey={yAxisKey}
            stroke="#8884d8"
            fill={randomColor}
          />
        ))}
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VisualizationAreaChart;
