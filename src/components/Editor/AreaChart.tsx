import React from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { queryValueData } from './MockData';

const VisualizationAreaChart = () => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        data={queryValueData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis dataKey="time" />
        <YAxis dataKey={'size'} />
        <Area dataKey="size" stroke="#8884d8" fill="#8884d8" />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VisualizationAreaChart;
