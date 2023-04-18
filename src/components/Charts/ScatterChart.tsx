import React from 'react';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartProps } from './LineChart';

type Props = ChartProps & {
  name?: string;
};
const VisualizationScatterChart = ({
  name,
  data,
  xAxisKey,
  yAxisKeys,
}: Props) => {
  return (
    <ResponsiveContainer width={'96%'} height={'92%'}>
      <ScatterChart>
        <XAxis dataKey={xAxisKey} />
        {yAxisKeys && !!yAxisKeys.length && <YAxis dataKey={yAxisKeys[0]} />}
        <Scatter name={name} data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default VisualizationScatterChart;
